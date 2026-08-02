import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EMBUR collects, uses, and protects business and customer information.",
};

const sections = [
  {
    title: "Information we collect",
    paragraphs: ["We collect information needed to provide EMBUR, operate customer workspaces, process subscriptions, improve the service, and protect accounts."],
    bullets: [
      "Account and business information, including names, email addresses, phone numbers, company details, preferences, and authentication identifiers.",
      "Customer and lead information that a business or its customers submit, including contact details, service requests, conversations, addresses, appointment details, and notes.",
      "Billing records and subscription status. Payment card data is collected and processed by Stripe; EMBUR does not store full card numbers.",
      "Technical and usage information such as IP address, device and browser details, logs, feature usage, and security events.",
    ],
  },
  {
    title: "How we use information",
    bullets: [
      "Provide, secure, troubleshoot, and improve the EMBUR service.",
      "Organize leads, conversations, recommendations, and business activity inside the correct workspace.",
      "Generate AI-assisted summaries, drafts, priorities, and suggested actions.",
      "Process subscriptions, prevent fraud, respond to support requests, and send essential service notices.",
      "Comply with law and enforce our agreements.",
    ],
  },
  {
    title: "AI and service providers",
    paragraphs: [
      "EMBUR uses trusted service providers to operate the product. These may include Clerk for authentication, Stripe for billing, OpenAI for AI-assisted features, Vercel for application hosting, and Neon for database infrastructure. Information is shared only as reasonably necessary for those providers to perform services for EMBUR.",
      "AI output may be incomplete or inaccurate. Business owners remain responsible for reviewing communications and decisions before relying on them, especially for emergencies, pricing, advertising, legal, medical, financial, or safety-related matters.",
    ],
  },
  {
    title: "Business customer responsibilities",
    paragraphs: ["A business using EMBUR controls the customer information placed in its workspace and is responsible for providing any notices and obtaining any permissions required for calls, texts, email, recording, advertising, and customer outreach. EMBUR processes that information to provide the requested service."],
  },
  {
    title: "Sharing and sale of information",
    paragraphs: ["We do not sell personal information for money. We may disclose information to service providers, professional advisers, authorities when legally required, or as part of a business transaction such as a financing, acquisition, or sale, subject to appropriate safeguards."],
  },
  {
    title: "Retention and security",
    paragraphs: ["We retain information for as long as needed to provide the service, meet contractual and legal obligations, resolve disputes, and protect EMBUR and its users. We use reasonable administrative, technical, and organizational safeguards, but no online system can guarantee absolute security."],
  },
  {
    title: "Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, delete, restrict, or receive a copy of certain personal information. You may also withdraw consent where consent is the basis for processing. Account owners can update much of their information inside EMBUR.",
      "To make a privacy request, email hello@getembur.com. We may need to verify your identity and authority before completing a request.",
    ],
  },
  {
    title: "Children, changes, and contact",
    paragraphs: [
      "EMBUR is a business service and is not directed to children under 13. We may update this policy as the product or law changes. Material updates will be posted here with a new effective date.",
      "Questions about this policy may be sent to hello@getembur.com.",
    ],
  },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Trust and data" title="Privacy Policy" summary="Plain-language details about the information EMBUR handles and the choices available to you." sections={sections} />;
}
