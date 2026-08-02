import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "EMBUR subscription cancellation and refund policy.",
};

const sections = [
  { title: "Subscription charges", paragraphs: ["EMBUR subscriptions are billed in advance for the billing period shown at checkout. Except where required by law, subscription charges are non-refundable once a billing period begins."] },
  { title: "Canceling a plan", paragraphs: ["You may cancel before your next renewal through available account controls or by emailing hello@getembur.com. Cancellation prevents future renewal charges. Access normally continues through the end of the paid billing period unless the account is terminated for misuse or security reasons."] },
  { title: "Billing errors and duplicate charges", paragraphs: ["If you believe a charge was duplicated or made in error, contact hello@getembur.com within 14 days of the charge. Include the account email, charge date, amount, and a short explanation. We will review the payment record and correct confirmed errors."] },
  { title: "Third-party and usage costs", paragraphs: ["Amounts already spent on advertising, messaging, phone usage, third-party services, or other metered resources are not refundable once incurred, unless required by law or caused by a confirmed EMBUR billing error."] },
  { title: "How to request review", paragraphs: ["Email hello@getembur.com with the subject “Billing review.” We aim to acknowledge requests within two business days. Approval of any exception is at EMBUR’s discretion unless applicable law requires otherwise."] },
];

export default function RefundPage() {
  return <LegalPage eyebrow="Clear billing" title="Refund Policy" summary="Simple terms for renewals, cancellations, billing errors, and refund reviews." sections={sections} />;
}
