"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const painPoints = [
  {
    id: "missed-calls",
    title: "Missed Calls",
    description: "Customers call while your team is busy or after hours.",
  },
  {
    id: "follow-ups",
    title: "Follow-ups",
    description: "Good leads go cold because nobody has time to chase them.",
  },
  {
    id: "scheduling",
    title: "Scheduling",
    description: "Booking and confirming appointments takes too much effort.",
  },
  {
    id: "dispatching",
    title: "Dispatching",
    description: "Keeping technicians and customers coordinated creates stress.",
  },
  {
    id: "office-overload",
    title: "Office Overload",
    description: "Your office spends too much time on repetitive work.",
  },
  {
    id: "growing-too-fast",
    title: "Growing Too Fast",
    description: "Demand is increasing faster than your systems can handle it.",
  },
  {
    id: "hiring-help",
    title: "Hiring Help",
    description: "You need support without immediately adding another salary.",
  },
  {
    id: "something-else",
    title: "Something Else",
    description: "Your biggest time problem is not listed here.",
  },
];

type JourneyData = {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  painPoints: string[];
  additionalDetails: string;
};

const initialData: JourneyData = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  painPoints: [],
  additionalDetails: "",
};

export default function GetMyTimeBack() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JourneyData>(initialData);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof JourneyData, value: string) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function togglePainPoint(id: string) {
    setData((current) => ({
      ...current,
      painPoints: current.painPoints.includes(id)
        ? current.painPoints.filter((item) => item !== id)
        : [...current.painPoints, id],
    }));

    setError("");
  }

  function goToStep(nextStep: number) {
    setError("");
    setStep(nextStep);
  }

  function continueFromBusinessDetails() {
    if (!data.name.trim() || !data.businessName.trim()) {
      setError("Please enter your name and business name.");
      return;
    }

    goToStep(2);
  }

  function continueFromContactDetails() {
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const phoneHasEnoughNumbers =
      data.phone.replace(/\D/g, "").length >= 10;

    if (!data.phone.trim() || !data.email.trim()) {
      setError("Please enter your phone number and email address.");
      return;
    }

    if (!phoneHasEnoughNumbers) {
      setError("Please enter a complete phone number.");
      return;
    }

    if (!emailIsValid) {
      setError("Please enter a valid email address.");
      return;
    }

    goToStep(3);
  }

  function submitJourney() {
    if (data.painPoints.length === 0) {
      setError("Choose at least one challenge so we can prepare for you.");
      return;
    }

    const submission = {
      ...data,
      submittedAt: new Date().toISOString(),
      source: "get-my-time-back",
    };

    console.log("EMBUR journey submission:", submission);

    setSubmitted(true);
    setError("");
  }

  function restartJourney() {
    setData(initialData);
    setStep(0);
    setSubmitted(false);
    setError("");
  }

  if (submitted) {
    const firstName = data.name.trim().split(" ")[0] || "there";

    const selectedTitles = painPoints
      .filter((point) => data.painPoints.includes(point.id))
      .map((point) => point.title);

    return (
      <section
        id="time-back"
        className="mx-auto max-w-5xl scroll-mt-8 px-5 py-20 md:px-8 md:py-24"
      >
        <div className="overflow-hidden rounded-3xl border bg-white shadow-xl">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-12 text-center text-white md:px-12 md:py-16">
            <img
              src="/embur-logo.png"
              alt="EMBUR"
              className="mx-auto h-16 w-16 rounded-2xl object-contain shadow-lg"
            />

            <p className="mt-6 text-sm font-bold uppercase tracking-wider text-blue-200">
              Time returned starts here
            </p>

            <h3 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Welcome to EMBUR, {firstName}.
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              While you get back to your day, we&apos;ll begin learning about{" "}
              {data.businessName} and where EMBUR can return the most time.
            </p>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid gap-5 md:grid-cols-3">
              <JourneyNextStep
                label="Today"
                title="We review your business."
                description="We study the challenges you selected before speaking with you."
              />

              <JourneyNextStep
                label="Next"
                title="We plan your walkthrough."
                description="Your conversation will focus on your business, not generic software."
              />

              <JourneyNextStep
                label="Then"
                title="We show your time back."
                description="You see exactly how EMBUR can carry part of the daily workload."
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                  What you told us
                </p>

                <h4 className="mt-3 text-2xl font-bold">
                  Your biggest time challenges
                </h4>

                <div className="mt-5 flex flex-wrap gap-3">
                  {selectedTitles.map((title) => (
                    <span
                      key={title}
                      className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800"
                    >
                      {title}
                    </span>
                  ))}
                </div>

                {data.additionalDetails.trim() && (
                  <div className="mt-6 rounded-2xl border bg-white p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Additional context
                    </p>
                    <p className="mt-2 leading-relaxed text-slate-700">
                      {data.additionalDetails}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-blue-50 p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                  The EMBUR promise
                </p>

                <h4 className="mt-3 text-3xl font-bold text-slate-950">
                  Your business keeps moving.
                </h4>

                <p className="mt-4 leading-relaxed text-slate-600">
                  EMBUR is designed to handle the repetitive work that steals
                  your attention, so more of your time belongs to you again.
                </p>

                <p className="mt-6 text-lg font-semibold text-slate-900">
                  Because owning a business should not mean sacrificing your
                  life.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border bg-white p-6 md:flex-row">
              <div>
                <p className="font-bold text-slate-950">
                  See EMBUR running a business now.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Launch the interactive company experience.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#dashboard"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Launch Demo Business →
                </a>

                <button
                  type="button"
                  onClick={restartJourney}
                  className="rounded-xl border bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="time-back"
      className="mx-auto max-w-5xl scroll-mt-8 px-5 py-20 md:px-8 md:py-24"
    >
      <div className="overflow-hidden rounded-3xl border bg-white shadow-xl">
        <div className="border-b bg-slate-950 px-6 py-6 text-white md:px-10">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <img
                src="/embur-logo.png"
                alt="EMBUR"
                className="h-10 w-10 rounded-xl object-contain"
              />

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
                  Get your time back
                </p>
                <p className="text-sm text-slate-400">
                  About two minutes to complete
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-300">
              Step {step + 1} of 4
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300 transition-all duration-300"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6 md:p-10">
          {step === 0 && (
            <div className="py-6 text-center md:py-10">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                A better business starts with your time
              </p>

              <h3 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
                What would you do with five extra hours every week?
              </h3>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                EMBUR is built to recover opportunities, organize your day, and
                carry the repetitive work that keeps following you home.
              </p>

              <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
                <JourneyBenefit
                  title="No sales pressure"
                  description="This begins with understanding your business."
                />
                <JourneyBenefit
                  title="Built around you"
                  description="Your walkthrough uses your real challenges."
                />
                <JourneyBenefit
                  title="Focused on time"
                  description="We show where hours can be returned."
                />
              </div>

              <div className="mt-9">
                <Button onClick={() => goToStep(1)}>Begin →</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Your business
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Tell us a little about you.
              </h3>

              <p className="mt-3 text-slate-600">
                We&apos;ll use this to make your EMBUR experience feel personal.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <JourneyField
                  label="Your name"
                  value={data.name}
                  placeholder="Mike Johnson"
                  autoComplete="name"
                  onChange={(value) => updateField("name", value)}
                />

                <JourneyField
                  label="Business name"
                  value={data.businessName}
                  placeholder="Mike's Heating & Air"
                  autoComplete="organization"
                  onChange={(value) => updateField("businessName", value)}
                />
              </div>

              <JourneyError message={error} />

              <JourneyActions
                onBack={() => goToStep(0)}
                onContinue={continueFromBusinessDetails}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Stay connected
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                How should we reach you?
              </h3>

              <p className="mt-3 text-slate-600">
                We&apos;ll use these details only to continue your EMBUR
                conversation.
              </p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <JourneyField
                  label="Phone number"
                  type="tel"
                  value={data.phone}
                  placeholder="(555) 555-1212"
                  autoComplete="tel"
                  onChange={(value) => updateField("phone", value)}
                />

                <JourneyField
                  label="Email address"
                  type="email"
                  value={data.email}
                  placeholder="mike@business.com"
                  autoComplete="email"
                  onChange={(value) => updateField("email", value)}
                />
              </div>

              <JourneyError message={error} />

              <JourneyActions
                onBack={() => goToStep(1)}
                onContinue={continueFromContactDetails}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Your time
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                What is stealing the most time?
              </h3>

              <p className="mt-3 text-slate-600">
                Choose everything that applies. Your answers shape the
                experience we prepare.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {painPoints.map((point) => {
                  const isSelected = data.painPoints.includes(point.id);

                  return (
                    <button
                      type="button"
                      key={point.id}
                      onClick={() => togglePainPoint(point.id)}
                      aria-pressed={isSelected}
                      className={`rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "bg-white hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "border bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                        <div>
                          <p
                            className={`font-bold ${
                              isSelected
                                ? "text-blue-900"
                                : "text-slate-900"
                            }`}
                          >
                            {point.title}
                          </p>

                          <p className="mt-1 text-sm leading-relaxed text-slate-500">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="additional-details"
                  className="text-sm font-semibold text-slate-700"
                >
                  Anything else we should understand?{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>

                <textarea
                  id="additional-details"
                  value={data.additionalDetails}
                  onChange={(event) =>
                    updateField("additionalDetails", event.target.value)
                  }
                  placeholder="Tell us what a better workday would look like..."
                  className="mt-2 min-h-32 w-full resize-y rounded-xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <JourneyError message={error} />

              <div className="mt-8 rounded-2xl bg-slate-50 p-6">
                <p className="font-bold text-slate-950">
                  EMBUR is designed to help you:
                </p>

                <div className="mt-4 grid gap-3 text-slate-600 sm:grid-cols-2">
                  <p>✓ Recover missed opportunities.</p>
                  <p>✓ Reduce office interruptions.</p>
                  <p>✓ Prioritize valuable customers.</p>
                  <p>✓ Return hours to your week.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button variant="secondary" onClick={() => goToStep(2)}>
                  ← Back
                </Button>

                <Button onClick={submitJourney}>
                  Let&apos;s Get My Time Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function JourneyField({
  label,
  value,
  placeholder,
  type = "text",
  autoComplete,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-4 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function JourneyActions({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Button variant="secondary" onClick={onBack}>
        ← Back
      </Button>

      <Button onClick={onContinue}>Continue →</Button>
    </div>
  );
}

function JourneyError({ message }: { message: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
    >
      {message}
    </div>
  );
}

function JourneyBenefit({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="font-bold text-slate-950">✓ {title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

function JourneyNextStep({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
        {label}
      </p>
      <p className="mt-2 font-bold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}