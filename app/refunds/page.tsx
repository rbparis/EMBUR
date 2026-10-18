import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "EMBUR paid-enrollment status and billing review contact.",
};

const sections = [
  { title: "Subscription charges", paragraphs: ["Paid enrollment is paused. The planned pilot is free and applications are not open yet. No new paid subscription starts from the early-access page."] },
  { title: "Canceling a plan", paragraphs: ["There is no new paid plan to enroll in during this holding period. Any future paid plan will disclose cancellation and refund terms before purchase."] },
  { title: "Billing errors and duplicate charges", paragraphs: ["If you believe a charge was duplicated or made in error, contact getembur@gmail.com within 14 days of the charge. Include the account email, charge date, amount, and a short explanation. We will review the payment record and correct confirmed errors."] },
  { title: "Third-party and usage costs", paragraphs: ["EMBUR does not currently offer live call handling, automated messaging, or advertising services. Any future usage costs will be disclosed before activation."] },
  { title: "How to request review", paragraphs: ["Email getembur@gmail.com with the subject “Billing review.” We will respond as soon as we can. Approval of any exception is at EMBUR’s discretion unless applicable law requires otherwise."] },
];

export default function RefundPage() {
  return <LegalPage eyebrow="Clear billing" title="Refund Policy" summary="Paid enrollment is paused. Contact us about any historical billing error or refund question." sections={sections} />;
}
