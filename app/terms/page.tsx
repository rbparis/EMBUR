import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you access or use EMBUR.",
};

const sections = [
  { title: "Agreement and eligibility", paragraphs: ["These Terms govern access to and use of EMBUR. By creating an account, purchasing a subscription, or using the service, you agree to these Terms. You must be legally able to enter a binding agreement and use EMBUR for a lawful business purpose."] },
  { title: "Accounts and business data", paragraphs: ["You are responsible for accurate account information, safeguarding login credentials, activities within your workspace, and promptly notifying EMBUR of suspected unauthorized access. You retain ownership of the business and customer information you submit and grant EMBUR permission to process it to provide, secure, and improve the service."] },
  {
    title: "Subscriptions and billing",
    paragraphs: [
      "Paid plans renew automatically at the interval shown at checkout until canceled. You authorize Stripe and EMBUR to charge the selected payment method for subscription fees, taxes, usage charges, and other amounts clearly disclosed before purchase.",
      "You may cancel before the next renewal through available account controls or by contacting hello@getembur.com. Cancellation stops future renewals but does not ordinarily refund an already-started billing period. The Refund Policy is part of these Terms.",
    ],
  },
  { title: "Communications and outreach", paragraphs: ["You are responsible for ensuring that your use of calls, texts, email, customer lists, recordings, advertisements, and automated outreach complies with applicable laws, platform rules, consent requirements, opt-out requirements, and do-not-contact restrictions. Do not use EMBUR to send deceptive, abusive, unlawful, or unsolicited communications."] },
  {
    title: "AI-assisted features",
    paragraphs: [
      "EMBUR may produce summaries, drafts, priorities, recommendations, and other AI-assisted output. Output is provided as a working aid, may contain errors, and does not replace professional judgment. Review output before sending or acting on it.",
      "EMBUR is not an emergency service and does not provide legal, tax, medical, financial, trade, or safety advice. If a situation may involve immediate danger, contact 911 or the appropriate emergency or utility service.",
    ],
  },
  {
    title: "Acceptable use",
    bullets: [
      "Do not break the law, violate another person’s rights, impersonate others, or submit information you have no right to use.",
      "Do not probe, disrupt, overload, reverse engineer, copy, resell, or bypass security or access controls except where law expressly permits.",
      "Do not use EMBUR to distribute malware, spam, harassment, discrimination, fraud, or misleading claims.",
      "Do not use generated content or automation without the review, disclosures, permissions, and approvals required for your business.",
    ],
  },
  { title: "Availability and changes", paragraphs: ["We work to keep EMBUR dependable, but do not promise uninterrupted or error-free operation. Features may change as the product improves. We may suspend access when necessary for security, maintenance, nonpayment, legal compliance, or material violation of these Terms."] },
  {
    title: "Disclaimers and liability",
    paragraphs: [
      "To the fullest extent allowed by law, EMBUR is provided “as is” and “as available,” without warranties of merchantability, fitness for a particular purpose, non-infringement, or guaranteed business results. EMBUR does not guarantee leads, revenue, rankings, booked jobs, or advertising performance.",
      "To the fullest extent allowed by law, EMBUR and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or lost-profit damages. Total liability arising from the service will not exceed the amount you paid EMBUR during the six months before the event giving rise to the claim.",
    ],
  },
  {
    title: "Ending use and contact",
    paragraphs: [
      "You may stop using EMBUR at any time. Terms that by their nature should survive will remain in effect, including payment obligations, ownership, disclaimers, and liability limits. We may update these Terms and will post material changes with a new effective date.",
      "Questions about these Terms may be sent to hello@getembur.com.",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage eyebrow="The working agreement" title="Terms of Service" summary="The rules that protect business owners, their customers, and the EMBUR service." sections={sections} />;
}
