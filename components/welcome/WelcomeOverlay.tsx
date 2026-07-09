import Button from "@/components/ui/Button";

type WelcomeOverlayProps = {
  step: number;
  onStart: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function WelcomeOverlay({
  step,
  onStart,
  onNext,
  onClose,
}: WelcomeOverlayProps) {
  const screens = [
    {
      label: "Today's Welcome Brief",
      title: "☀️ Good morning, Mike.",
      body: (
        <>
          Yesterday <strong>YOU</strong> recovered{" "}
          <strong>$3,250</strong> that would have otherwise been lost.
          <br />
          <br />
          Today looks busy. Let&apos;s knock out your priorities.
        </>
      ),
      primary: "▶ Start My Day",
    },
    {
      label: "Priority #1",
      title: "Call Mike Brown",
      body: (
        <>
          Emergency AC Repair • Waiting 11 hours
          <br />
          Potential revenue: <strong>$1,250</strong>
        </>
      ),
      primary: "Mark Complete",
    },
    {
      label: "Priority Complete",
      title: "Nice. One priority handled.",
      body: "Mike Brown has been marked as contacted. One customer still needs attention.",
      primary: "Next Priority",
    },
    {
      label: "Caught Up",
      title: "You're caught up.",
      body: "Your highest-priority customer issues are handled. Go grow your business.",
      primary: "Return to Dashboard",
    },
  ];

  const current = screens[step];

  function handlePrimaryClick() {
    if (step === 0) {
      onStart();
      return;
    }

    if (step === 1 || step === 2) {
      onNext();
      return;
    }

    onClose();
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl">
        <p className="text-sm font-bold text-blue-700">{current.label}</p>

        <h3 className="mt-4 text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
          {current.title}
        </h3>

        <p className="mt-6 text-lg leading-relaxed text-slate-600 md:text-xl">
          {current.body}
        </p>

        {step === 1 && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button>📞 Call Customer</Button>
            <Button variant="secondary">✉️ Send Text</Button>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={handlePrimaryClick}
            variant={step === 3 ? "dark" : "primary"}
          >
            {current.primary}
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}