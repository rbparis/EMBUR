export type OutreachProspectInput = {
  company: string;
  ownerName?: string;
  email: string;
  city?: string;
  notes?: string;
};

export type OutreachEmailDraft = {
  step: 1 | 2 | 3;
  day: 0 | 2 | 5;
  label: string;
  subject: string;
  body: string;
};

function greeting(ownerName?: string) {
  return ownerName?.trim() ? `Hi ${ownerName.trim()},` : "Hi there,";
}

export function buildOutreachFallback(
  prospect: OutreachProspectInput
): OutreachEmailDraft[] {
  const company = prospect.company.trim();
  const cityLine = prospect.city?.trim()
    ? ` in ${prospect.city.trim()}`
    : "";

  return [
    {
      step: 1,
      day: 0,
      label: "Introduction",
      subject: `A quick idea for ${company}`,
      body: `${greeting(prospect.ownerName)}

I’m Joon, the founder of EMBUR. We built it for independent service businesses that lose good work when calls are missed or follow-up gets buried.

EMBUR helps capture the request, organize the opportunity, and show the owner the next move—without adding another person to chase every lead.

Would a 15-minute look be useful for ${company}${cityLine}?

Joon
Founder, EMBUR
getembur.com

If this is not relevant, reply no and I will not follow up.`,
    },
    {
      step: 2,
      day: 2,
      label: "Useful follow-up",
      subject: `Re: A quick idea for ${company}`,
      body: `${greeting(prospect.ownerName)}

One reason I reached out: a missed call is not just a message—it can be the job that would have filled tomorrow’s schedule.

EMBUR gives local service owners one place to see the lead, the money attached, and the strongest next action.

If lead follow-up is already handled perfectly at ${company}, I’ll leave you alone. If not, I’d be glad to show you the workflow in 15 minutes.

Joon
getembur.com`,
    },
    {
      step: 3,
      day: 5,
      label: "Respectful close",
      subject: `Should I close the loop, ${company}?`,
      body: `${greeting(prospect.ownerName)}

I’ll close the loop after this.

If missed calls or slow follow-up ever cost ${company} a job, EMBUR was built to help. I can show you the working product in 15 minutes—no long presentation.

Worth a look, or should I step back?

Joon
getembur.com`,
    },
  ];
}

