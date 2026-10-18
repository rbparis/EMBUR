import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you access or use EMBUR.",
};

const sections = [
  { title: "Agreement and eligibility", paragraphs: ["These Terms govern access to and use of EMBUR. By creating an account or using the service, you agree to these Terms. You must be legally able to enter a binding agreement and use EMBUR for a lawful business purpose."] },
  { title: "Accounts and business data", paragraphs: ["You are responsible for accurate account information, safeguarding login credentials, activities within your workspace, and promptly notifying EMBUR of suspected unauthorized access. You retain ownership of the business and customer information you submit and grant EMBUR permission to process it to provide, secure, and improve the service."] },
  {
    title: "Subscriptions and billing",
    paragraphs: [
      "Paid enrollment is paused. The planned pilot is free and applications are not open yet. No subscription or payment starts from the early-access page.",
      "Any future paid offering will state its price, billing interval, cancellation terms, and applicable refund policy before purchase. Contact getembur@gmail.com with questions about existing billing records.",
    ],
  },
  { title: "Communications and outreach", paragraphs: ["Call handling, booking, referrals, reputation tools, content and video tools, automated messaging, and traffic agents are not live services. You are responsible for ensuring that your own communications and any future use of outreach features comply with applicable laws, platform rules, consent requirements, opt-out requirements, and do-not-contact restrictions. Do not use EMBUR to send deceptive, abusive, unlawful, or unsolicited communications."] },
  {
    title: "AI-assisted features",
    paragraphs: [
      "Atlas suggests priorities and next steps for the inquiries in your workspace. Depending on how EMBUR is configured, suggestions may come from rules built into EMBUR or from an AI model provided by OpenAI. Suggestions may be incomplete or wrong, and you remain responsible for reviewing them before you act or send anything to a customer.",
      "EMBUR is not an emergency service and does not provide legal, tax, medical, financial, trade, or safety advice. If a situation may involve immediate danger, contact 911 or the appropriate emergency or utility service.",
    ],
  },
  {
    title: "Acceptable use",
    bullets: [
      "Do not break the law, violate another person’s rights, impersonate others, or submit information you have no right to use.",
      "Do not probe, disrupt, overload, reverse engineer, copy, resell, or bypass security or access controls except where law expressly permits.",
      "Do not use EMBUR to distribute malware, spam, harassment, discrimination, fraud, or misleading claims.",
    ],
  },
  { title: "Availability and changes", paragraphs: ["We work to keep EMBUR dependable, but do not promise uninterrupted or error-free operation. Features may change as the product improves. We may suspend access when necessary for security, maintenance, legal compliance, or material violation of these Terms."] },
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
      "You may stop using EMBUR at any time. Terms that by their nature should survive will remain in effect, including ownership, disclaimers, and liability limits. We may update these Terms and will post material changes with a new effective date.",
      "Questions about these Terms may be sent to getembur@gmail.com.",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage eyebrow="The working agreement" title="Terms of Service" summary="The rules that protect business owners, their customers, and the EMBUR service." sections={sections} />;
}
