import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AfterHoursIntake from "@/components/intake/AfterHoursIntake";
import EmburLogo from "@/components/brand/EmburLogo";
import { prisma } from "@/lib/prisma";

async function findBusiness(businessId: string) {
  return prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true, name: true, phone: true, industry: true },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ businessId: string }> }): Promise<Metadata> {
  const { businessId } = await params;
  const business = await findBusiness(businessId);
  return {
    title: business ? `Request service from ${business.name}` : "Service request",
    description: business ? `Send an after-hours service request directly to ${business.name}.` : "Send a service request.",
    robots: { index: false, follow: false },
  };
}

export default async function IntakePage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const business = await findBusiness(businessId);
  if (!business) notFound();

  return (
    <main className="min-h-screen bg-[#061027] px-4 py-8 text-white md:px-8 md:py-14">
      <div className="pointer-events-none fixed inset-0 embur-hero-grid opacity-40" />
      <div className="pointer-events-none fixed -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-blue-600/20 blur-[110px]" />
      <div className="pointer-events-none fixed -right-40 top-24 h-[30rem] w-[30rem] rounded-full bg-orange-500/15 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <EmburLogo light size="small" />
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-300">Powered by Atlas</span>
        </div>
        <AfterHoursIntake businessId={business.id} businessName={business.name} phone={business.phone} />
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-slate-500">This automated assistant collects your request for the business. It does not provide technical diagnoses or emergency services.</p>
      </div>
    </main>
  );
}
