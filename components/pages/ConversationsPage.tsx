import EmburIcon from "@/components/ui/EmburIcon";

export default function ConversationsPage() {
  return (
    <section className="mt-8 flex min-h-96 items-center justify-center rounded-3xl border bg-white p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <EmburIcon name="conversations" size={26} />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-950">
          You&apos;re all caught up.
        </h3>

        <p className="mt-3 leading-relaxed text-slate-500">
          New customer conversations will appear here automatically
          when EMBUR begins responding.
        </p>
      </div>
    </section>
  );
}