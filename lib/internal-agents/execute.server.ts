import { generateGrowthArtifact } from "@/lib/growth-agents/generate.server";
import type { GrowthAgentKind, GrowthAgentRequest } from "@/lib/growth-agents/content";
import { prisma } from "@/lib/prisma";
import { collectScoutProspects } from "@/lib/internal-agents/scoutSources.server";

function utcDayRange(date = new Date()) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

async function saveGeneratedArtifact(
  businessId: string,
  input: GrowthAgentRequest
) {
  const agent = input.kind === "social" ? "pulse" : input.kind === "seo" ? "rank" : "scout";
  const { artifact, source } = await generateGrowthArtifact(input);
  const record = await prisma.contentArtifact.create({
    data: {
      businessId,
      agent,
      kind: input.kind,
      title: artifact.title,
      summary: artifact.summary,
      content: artifact.content,
      checklist: artifact.checklist,
      channel: input.channel || null,
      keywords: [input.topic, input.location].filter((value): value is string => Boolean(value)),
      status: "draft",
    },
  });
  return { record, source };
}

async function existingArtifact(
  businessId: string,
  kind: GrowthAgentKind,
  start: Date,
  end: Date
) {
  return prisma.contentArtifact.findFirst({
    where: { businessId, kind, createdAt: { gte: start, lt: end } },
    orderBy: { createdAt: "desc" },
  });
}

async function finishTask(
  taskId: string,
  status: "completed" | "held",
  result: string,
  metadata?: Record<string, string | number | boolean>
) {
  return prisma.agentTask.update({
    where: { id: taskId },
    data: {
      status,
      result: result.slice(0, 4000),
      metadata,
      completedAt: status === "completed" ? new Date() : null,
    },
  });
}

export async function executeRevenueShift(businessId: string, date = new Date()) {
  const { start, end } = utcDayRange(date);
  const tasks = await prisma.agentTask.findMany({
    where: {
      businessId,
      scheduledFor: { gte: start, lt: end },
      status: { in: ["pending", "approved"] },
    },
    orderBy: { createdAt: "asc" },
  });

  const byType = new Map(tasks.map((task) => [task.taskType, task]));
  const outputs: Array<{ agent: string; status: string; result: string }> = [];

  const pulseTask = byType.get("social_draft");
  if (pulseTask) {
    const existing = await existingArtifact(businessId, "social", start, end);
    const generated = existing
      ? { record: existing, source: "saved" as const }
      : await saveGeneratedArtifact(businessId, {
          kind: "social",
          topic: "The real revenue cost of an unanswered HVAC call",
          audience: "Independent HVAC business owners",
          channel: "LinkedIn",
          notes: "Lead with a useful observation and invite a genuine owner conversation. Do not oversell EMBUR.",
        });
    const result = `Prepared "${generated.record.title}" as a ${generated.source} draft. One founder approval is required before publishing.`;
    await finishTask(pulseTask.id, "completed", result, { artifactId: generated.record.id });
    outputs.push({ agent: "pulse", status: "completed", result });
  }

  const rankTask = byType.get("seo_draft");
  if (rankTask) {
    const publishingDay = [1, 3, 5].includes(date.getUTCDay());
    if (!publishingDay) {
      const result = "No new article is due today. Rank remains on the Monday, Wednesday, Friday three-article cadence.";
      await finishTask(rankTask.id, "completed", result);
      outputs.push({ agent: "rank", status: "completed", result });
    } else {
      const existing = await existingArtifact(businessId, "seo", start, end);
      const generated = existing
        ? { record: existing, source: "saved" as const }
        : await saveGeneratedArtifact(businessId, {
            kind: "seo",
            topic: "HVAC missed call recovery",
            audience: "Independent HVAC business owners",
            location: "United States",
            channel: "EMBUR blog",
            notes: "Answer commercial search intent with practical steps. Avoid unsupported claims and keyword stuffing.",
          });
      const result = `Prepared "${generated.record.title}" as a ${generated.source} article draft. It is waiting for editorial approval.`;
      await finishTask(rankTask.id, "completed", result, { artifactId: generated.record.id });
      outputs.push({ agent: "rank", status: "completed", result });
    }
  }

  const scoutTask = byType.get("prospect_research");
  if (scoutTask) {
    const existing = await existingArtifact(businessId, "research", start, end);
    const generated = existing
      ? { record: existing, source: "saved" as const }
      : await saveGeneratedArtifact(businessId, {
          kind: "research",
          topic: "independent HVAC contractors",
          audience: "HVAC owners with meaningful after-hours call demand",
          location: "initial target market",
          channel: "approved public business source",
          notes: "Qualify 50 businesses and preserve the source URL. Never invent a business or private contact.",
        });
    try {
      const collection = await collectScoutProspects(businessId);
      const hitTarget = collection.found >= 50;
      const result = `Prepared "${generated.record.title}" and checked ${collection.market} through ${collection.source}. Found ${collection.found} verified public HVAC records; ${collection.created} were added and ${collection.updated} refreshed. ${hitTarget ? "The 50-prospect source target was reached." : `SOURCE CEILING: this market returned ${collection.found} of 50. Add a second approved source or market to continue.`} ${collection.attribution}.`;
      await finishTask(scoutTask.id, hitTarget ? "completed" : "held", result, {
        artifactId: generated.record.id,
        found: collection.found,
        created: collection.created,
        updated: collection.updated,
        blocker: !hitTarget,
      });
      outputs.push({ agent: "scout", status: hitTarget ? "completed" : "held", result });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "The public business source was unavailable.";
      const result = `Prepared "${generated.record.title}". SOURCE BLOCKER: ${reason} Scout did not invent or import unverified leads.`;
      await finishTask(scoutTask.id, "held", result, { artifactId: generated.record.id, blocker: true });
      outputs.push({ agent: "scout", status: "held", result });
    }
  }

  const hunterTask = byType.get("outreach_review");
  const verifierTask = byType.get("qualification_review");
  if (verifierTask) {
    const candidates = await prisma.outreachProspect.findMany({
      where: { businessId, stage: "research", optedOutAt: null },
      orderBy: { updatedAt: "asc" },
      take: 25,
    });
    let qualified = 0;
    let needsReview = 0;

    for (const prospect of candidates) {
      const evidence = [
        prospect.sourceUrl ? 30 : 0,
        prospect.location ? 20 : 0,
        prospect.website ? 20 : 0,
        prospect.notes?.toLowerCase().includes("phone") ? 15 : 0,
        /hvac|heating|cooling|air conditioning/i.test(`${prospect.company} ${prospect.notes ?? ""}`) ? 15 : 0,
      ];
      const score = evidence.reduce((sum, value) => sum + value, 0);
      const isQualified = score >= 65;
      const marker = `Verifier score: ${score}/100`;
      const notes = prospect.notes?.includes("Verifier score:")
        ? prospect.notes.replace(/Verifier score: \d+\/100[^.]*\.?/i, `${marker}.`)
        : [prospect.notes, `${marker}. ${isQualified ? "Qualified for founder review." : "Needs more public evidence before outreach."}`]
            .filter(Boolean)
            .join(" ");

      await prisma.outreachProspect.update({
        where: { id: prospect.id },
        data: { stage: isQualified ? "draft" : "research", notes },
      });
      if (isQualified) qualified += 1;
      else needsReview += 1;
    }

    const remaining = await prisma.outreachProspect.count({
      where: { businessId, stage: "research", optedOutAt: null },
    });
    const result = candidates.length
      ? `Reviewed ${candidates.length} public business records. ${qualified} qualified for founder review, ${needsReview} need more evidence, and ${remaining} remain in Scout's research queue. No contact data was invented and nothing was sent.`
      : "No unverified Scout records are waiting. Verifier will resume when Scout adds new public businesses.";
    await finishTask(verifierTask.id, "completed", result, { reviewed: candidates.length, qualified, needsReview, remaining });
    outputs.push({ agent: "verifier", status: "completed", result });
  }

  if (hunterTask) {
    const [approved, dueFollowUps, demos] = await Promise.all([
      prisma.outreachProspect.count({ where: { businessId, stage: "approved", optedOutAt: null } }),
      prisma.outreachProspect.count({
        where: {
          businessId,
          stage: "sent",
          optedOutAt: null,
          nextFollowUpAt: { lte: date },
        },
      }),
      prisma.outreachProspect.count({ where: { businessId, stage: "demo" } }),
    ]);
    const result = `${approved} approved introductions and ${dueFollowUps} follow-ups are ready for Joon's send approval. ${demos} demonstrations currently need a close decision.`;
    await finishTask(hunterTask.id, "completed", result, { approved, dueFollowUps, demos });
    outputs.push({ agent: "hunter", status: "completed", result });
  }

  const closerTask = byType.get("close_pipeline");
  if (closerTask) {
    const [replies, demos, wins] = await Promise.all([
      prisma.outreachProspect.count({ where: { businessId, stage: "replied", optedOutAt: null } }),
      prisma.outreachProspect.count({ where: { businessId, stage: "demo", optedOutAt: null } }),
      prisma.outreachProspect.count({ where: { businessId, stage: "won" } }),
    ]);
    const result = demos > 0
      ? `${demos} demonstration${demos === 1 ? "" : "s"} need a plan recommendation and paid decision. ${replies} additional warm repl${replies === 1 ? "y" : "ies"} need a demonstration request. ${wins} customer${wins === 1 ? "" : "s"} closed to date.`
      : replies > 0
        ? `${replies} warm repl${replies === 1 ? "y is" : "ies are"} ready for a demonstration request. No opportunity is at the close stage yet.`
        : "No warm replies or demonstrations are waiting. Closer's next input must come from approved Hunter conversations.";
    await finishTask(closerTask.id, "completed", result, { replies, demos, wins });
    outputs.push({ agent: "closer", status: "completed", result });
  }

  const launchTask = byType.get("customer_onboarding");
  if (launchTask) {
    const customers = await prisma.outreachProspect.findMany({
      where: { businessId, stage: "won" },
      select: { company: true, plan: true, wonAt: true },
      orderBy: { wonAt: "desc" },
      take: 10,
    });
    const newest = customers[0];
    const result = newest
      ? `${customers.length} paid customer${customers.length === 1 ? "" : "s"} require launch protection. Start with ${newest.company} (${newest.plan ?? "plan not recorded"}): confirm owner contact, call-routing requirements, after-hours script, test lead, and launch date.`
      : "No paid customer is waiting for onboarding. Launch is ready to take over immediately after the first recorded sale.";
    await finishTask(launchTask.id, "completed", result, { customers: customers.length });
    outputs.push({ agent: "launch", status: "completed", result });
  }

  const keeperTask = byType.get("retention_review");
  if (keeperTask) {
    const customers = await prisma.outreachProspect.findMany({
      where: { businessId, stage: "won" },
      select: { monthlyRevenue: true },
    });
    const mrr = customers.reduce((sum, customer) => sum + customer.monthlyRevenue, 0);
    const result = customers.length
      ? `Protect ${customers.length} active customer${customers.length === 1 ? "" : "s"} and $${mrr} MRR. Confirm value delivered, unresolved issues, referral timing, and only then an appropriate expansion opportunity.`
      : "No recurring revenue is recorded yet. Keeper is ready to begin health reviews as soon as Launch activates the first customer.";
    await finishTask(keeperTask.id, "completed", result, { customers: customers.length, mrr });
    outputs.push({ agent: "keeper", status: "completed", result });
  }

  const relayTask = byType.get("gmail_triage");
  if (relayTask) {
    const mailbox = process.env.EMBUR_GMAIL_ADDRESS || "getembur@gmail.com";
    const result = `BLOCKER: Relay is assigned to ${mailbox}, but the deployed app does not yet receive verified Gmail events. Inbox review and reply drafting remain approval-gated until Gmail activity reporting is connected.`;
    await finishTask(relayTask.id, "held", result, { blocker: true });
    outputs.push({ agent: "relay", status: "held", result });
  }

  const atlasTask = byType.get("manager_brief");
  if (atlasTask) {
    const [prospects, inboundDemos] = await Promise.all([
      prisma.outreachProspect.findMany({
        where: { businessId },
        select: { stage: true, monthlyRevenue: true },
      }),
      prisma.demoRequest.findMany({
        where: { businessId },
        select: { status: true },
      }),
    ]);
    const count = (stages: string[]) => prospects.filter((prospect) => stages.includes(prospect.stage)).length;
    const mrr = prospects
      .filter((prospect) => prospect.stage === "won")
      .reduce((sum, prospect) => sum + prospect.monthlyRevenue, 0);
    const researched = prospects.length;
    const awaitingVerification = count(["research"]);
    const readyForReview = count(["draft", "approved"]);
    const contacted = count(["sent", "replied", "demo", "won"]);
    const replies = count(["replied", "demo", "won"]);
    const demos = count(["demo", "won"]);
    const customers = count(["won"]);
    const newInbound = inboundDemos.filter((request) => request.status === "new").length;
    const bookedInbound = inboundDemos.filter((request) => request.status === "booked").length;
    const nextAction = newInbound > 0
      ? `Contact all ${newInbound} new inbound demonstration request${newInbound === 1 ? "" : "s"} before outbound work.`
      : bookedInbound > 0
        ? `Run the ${bookedInbound} booked demonstration${bookedInbound === 1 ? "" : "s"} and ask for a paid decision.`
      : researched === 0
      ? "Connect Scout's approved lead source and qualify the first 50 HVAC businesses."
      : awaitingVerification > 0
        ? `Review Verifier's queue and qualify the next ${Math.min(awaitingVerification, 25)} public businesses.`
      : contacted === 0
        ? `Approve and personally contact the best ${Math.min(readyForReview, 10)} qualified businesses.`
        : demos === 0
          ? "Follow up with every engaged owner and book the first demonstration."
          : "Close the warmest demonstration and record the paid plan.";
    const result = `MRR $${mrr} / $3,000. Funnel: ${researched} outbound prospects, ${newInbound} new inbound demos, ${bookedInbound} booked inbound demos, ${awaitingVerification} awaiting verification, ${readyForReview} ready for review, ${contacted} contacted, ${replies} replies, ${demos} outbound demos, ${customers} customers. Main move: ${nextAction}`;
    await finishTask(atlasTask.id, "completed", result, { mrr, researched, newInbound, bookedInbound, awaitingVerification, readyForReview, contacted, replies, demos, customers });
    outputs.push({ agent: "atlas", status: "completed", result });
  }

  return outputs;
}
