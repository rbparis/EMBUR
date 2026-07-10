"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function BookDemoForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <section
        id="demo"
        className="max-w-4xl mx-auto px-8 py-24 text-center"
      >
        <div className="rounded-3xl border bg-white p-10 shadow-xl">
          <p className="text-sm font-bold text-blue-700">DEMO REQUEST SENT</p>

          <h3 className="mt-4 text-4xl font-bold">
            You&apos;re on the list.
          </h3>

          <p className="mt-5 text-lg text-slate-600">
            We&apos;ll reach out soon to schedule a live EMBUR walkthrough and
            learn how we can help give your business more time back.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" className="max-w-5xl mx-auto px-8 py-24">
      <div className="rounded-3xl border bg-white p-10 shadow-xl">
        <div className="text-center">
          <p className="text-sm font-bold text-blue-700">BOOK A DEMO</p>

          <h3 className="mt-4 text-4xl font-bold">
            See how EMBUR can give your business time back.
          </h3>

          <p className="mt-5 text-lg text-slate-600">
            Tell us a little about your business. We&apos;ll walk you through
            how EMBUR recovers missed opportunities, organizes your day, and
            returns time to the owner.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
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

          <input
            required
            type="email"
            placeholder="Email"
            className="rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
          />

          <input
            required
            placeholder="Phone"
            className="rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
          />

          <textarea
            placeholder="What steals the most time from your day?"
            className="md:col-span-2 min-h-32 rounded-xl border bg-slate-50 px-4 py-4 outline-none focus:border-blue-600"
          />

          <div className="md:col-span-2 flex justify-center">
            <Button>Request My Demo</Button>
          </div>
        </form>
      </div>
    </section>
  );
}