import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EMBUR collects, uses, and protects business and customer information.",
};

const sections = [
  {
    title: "Information we collect",
    paragraphs: ["We collect information needed to provide EMBUR, operate customer workspaces, maintain any historical billing records, improve the service, and protect accounts."],
    bullets: [
      "Account and business information, including names, email addresses, phone numbers, company details, preferences, and authentication identifiers.",
      "Customer and lead information that a business or its customers submit, including contact details, service requests, conversations, addresses, appointment details, and notes.",
      "Historical billing records and subscription status, if any. Paid enrollment is paused. Stripe processes payment-card data when a paid offering is available; EMBUR does not store full card numbers.",
      "Technical and usage information such as IP address, device and browser details, logs, feature usage, and security events.",
    ],
  },
  {
    title: "How we use information",
    bullets: [
      "Provide, secure, troubleshoot, and improve the EMBUR service.",
      "Organize leads, conversations, recommendations, and business activity inside the correct workspace.",
      "Rank inquiries and suggest next steps in Atlas, using rules built into EMBUR or, when enabled, an AI model.",
      "Maintain historical billing records, prevent fraud, respond to support requests, and provide essential service notices.",
      "Comply with law and enforce our agreements.",
    ],
  },
  {
    title: "AI and service providers",
    paragraphs: [
      "EMBUR uses service providers to operate the product: Clerk for sign-in, Vercel for hosting, and Neon for database storage. Stripe handles payment data for any historical or future paid offering. OpenAI may process information from your workspace that Atlas uses to make suggestions, such as customer names, service types, request status, estimated values, and questions you type to Atlas, when AI-model suggestions are enabled.",
      "Atlas suggestions may be incomplete or inaccurate. You remain responsible for reviewing communications and decisions before relying on them, especially for emergencies, pricing, advertising, legal, medical, financial, or safety-related matters.",
    ],
  },
  {
    title: "Business customer responsibilities",
    paragraphs: ["A business using EMBUR controls the customer information placed in its workspace and is responsible for providing any notices and obtaining any permissions required for calls, texts, email, recording, advertising, and customer outreach. EMBUR processes that information to provide the requested service. EMBUR does not currently place calls or send texts on a business's behalf."],
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
      "To make a privacy request, email getembur@gmail.com. We may need to verify your identity and authority before completing a request.",
    ],
  },
  {
    title: "Children, changes, and contact",
    paragraphs: [
      "EMBUR is a business service and is not directed to children under 13. We may update this policy as the product or law changes. Material updates will be posted here with a new effective date.",
      "Questions about this policy may be sent to getembur@gmail.com.",
    ],
  },
];

export default function PrivacyPage() {
  return <LegalPage eyebrow="Trust and data" title="Privacy Policy" summary="Plain-language details about the information EMBUR handles and the choices available to you." sections={sections} />;
}
