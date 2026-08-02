export type GrowthAgentKind = "social" | "seo" | "research";

export type GrowthAgentRequest = {
  kind: GrowthAgentKind;
  topic: string;
  audience?: string;
  location?: string;
  channel?: string;
  notes?: string;
};

export type GrowthAgentArtifact = {
  kind: GrowthAgentKind;
  title: string;
  summary: string;
  content: string;
  checklist: string[];
};

export function buildGrowthAgentFallback(
  request: GrowthAgentRequest
): GrowthAgentArtifact {
  const location = request.location?.trim() || "the local market";
  const audience = request.audience?.trim() || "independent HVAC owners";

  if (request.kind === "social") {
    return {
      kind: "social",
      title: `Social post: ${request.topic}`,
      summary: `A practical, founder-led post for ${audience}.`,
      content: `A missed call is rarely “just a message.”

For a local service business, it may be tomorrow’s repair, replacement, or lifelong customer.

EMBUR helps capture the request, organize the opportunity, and show the owner what needs attention next.

If you run a service business, what happens when nobody can answer?

getembur.com`,
      checklist: [
        `Publish manually on ${request.channel?.trim() || "the selected channel"}`,
        "Respond to genuine questions in the founder’s voice",
        "Record profile visits, replies, and demonstration requests",
      ],
    };
  }

  if (request.kind === "seo") {
    return {
      kind: "seo",
      title: `How ${request.topic} affects local HVAC revenue`,
      summary: `Keyword-led article targeting ${request.topic} in ${location}.`,
      content: `# How ${request.topic} affects local HVAC revenue

For an independent HVAC business, missed opportunities often look small in the moment: one unanswered call, one estimate without a follow-up, or one customer who never receives a response.

## Why response speed matters

Homeowners usually contact more than one provider when heating or cooling fails. The company that responds clearly and quickly is more likely to earn the conversation.

## What a reliable follow-up process includes

- Capture the customer’s name, contact information, problem, urgency, and service address.
- Put every opportunity in one visible queue.
- Assign the next action and a clear response deadline.
- Continue respectful follow-up until the customer replies or opts out.

## A practical next step

Review the last ten missed calls and open estimates in your business. Count how many received a documented response. That gap is where a better system can create revenue.

EMBUR helps local service owners see the opportunity, the money attached, and the next move. Learn more at getembur.com.`,
      checklist: [
        `Use “${request.topic}” naturally in the title, introduction, and one subheading`,
        "Add an original screenshot or product demonstration",
        "Link to one relevant EMBUR product page and submit the URL for indexing",
      ],
    };
  }

  return {
    kind: "research",
    title: `${location} ${request.topic} prospect research`,
    summary: `A qualification plan for finding relevant ${audience} without purchasing personal data.`,
    content: `Research public business listings for ${request.topic} companies in ${location}.

Prioritize independently owned businesses that:

1. Offer emergency or after-hours service.
2. Depend heavily on inbound phone calls.
3. Have no visible online intake or missed-call recovery process.
4. Show recent customer demand through public reviews.
5. Publish a legitimate business email or contact form.

For every prospect, record the company, website, public business contact, location, reason EMBUR may be relevant, and the exact public source. Do not infer private email addresses or collect personal contact data.`,
    checklist: [
      "Confirm the business is independently operated",
      "Record the public source and date checked",
      "Score problem fit before adding the prospect to Hunter",
      "Exclude prior opt-outs and irrelevant businesses",
    ],
  };
}

