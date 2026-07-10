"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

const painPoints = [
  "Missed Calls",
  "Follow-ups",
  "Scheduling",
  "Dispatching",
  "Office Overload",
  "Growing Too Fast",
  "Hiring Help",
  "Something Else",
];

export default function GetMyTimeBack() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function togglePainPoint(item: string) {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  }

  if (submitted) {
    return (
      <section id="time-back" className="max-w-5xl mx-auto px-8 py-24">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-xl">
          <p className="text-sm font-bold text-blue-700">TIME RETURNED STARTS HERE</p>
          <h3 className="mt-4 text-4xl font-bold">You&apos;re on your way.</h3>
          <p className="mt-5 text-lg text-slate-600">
            We&apos;ll review your business before we meet, so our conversation
            is focused on giving you time back — not wasting it.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3 text-left">
            {[
              "We review your business.",
              "We schedule your walkthrough.",
              "We show where EMBUR can return time.",
            ].map((item, index) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-blue-700">STEP {index + 1}</p>
                <p className="mt-2 font-semibold">{item}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xl font-semibold">
            We can&apos;t wait to meet you.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="time-back" className="max-w-5xl mx-auto px-8 py-24">
      <div className="rounded-3xl border bg-white p-10 shadow-xl">
        <div className="mb-10">
          <p className="text-sm font-bold text-blue-700">GET YOUR TIME BACK</p>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {step === 0 && (
          <div className="text-center">
            <h3 className="text-4xl font-bold">Let&apos;s get your time back.</h3>
            <p className="mt-5 text-lg text-slate-600">
              Every business is different. We&apos;d like to understand yours
              before we meet.
            </p>

            <div className="mt-8">
              <Button onClick={() => setStep(1)}>Begin →</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <form className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold">Tell us about you.</h3>
            </div>

            <input
              required
              placeholder="Your name"
              className="rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
            />

            <input
              required
              placeholder="Business name"
              className="rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
            />

            <div className="md:col-span-2 mt-4 flex gap-4">
              <Button onClick={() => setStep(2)}>Continue →</Button>
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold">How can we reach you?</h3>
            </div>

            <input
              required
              placeholder="Phone"
              className="rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
            />

            <input
              required
              type="email"
              placeholder="Email"
              className="rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
            />

            <div className="md:col-span-2 mt-4 flex gap-4">
              <Button onClick={() => setStep(3)}>Continue →</Button>
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-3xl font-bold">What&apos;s stealing your time?</h3>
            <p className="mt-3 text-slate-600">
              Choose anything that applies. This helps us make your walkthrough useful.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {painPoints.map((item) => (
                <button
                  key={item}
                  onClick={() => togglePainPoint(item)}
                  className={`rounded-2xl border p-5 text-left font-semibold transition ${
                    selected.includes(item)
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {selected.includes(item) ? "✓ " : ""}{item}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6">
              <p className="font-bold">Based on what you told us, EMBUR can help:</p>
              <div className="mt-4 space-y-2 text-slate-600">
                <p>✓ Recover missed opportunities automatically.</p>
                <p>✓ Reduce office interruptions.</p>
                <p>✓ Prioritize high-value customers.</p>
                <p>✓ Return hours to your week.</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button onClick={() => setSubmitted(true)}>
                Let&apos;s Get My Time Back
              </Button>
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}