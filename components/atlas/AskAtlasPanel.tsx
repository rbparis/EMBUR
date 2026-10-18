"use client";

import {
  FormEvent,
  useState,
} from "react";
import type { AtlasMemory } from "@/lib/intelligence/memory/types";
import type { AtlasSnapshot } from "@/lib/intelligence/types";
import { askAtlas } from "@/services/askAtlasApi";

type AskAtlasPanelProps = {
  snapshot: AtlasSnapshot;
  memory?: AtlasMemory | null;
};

const suggestedQuestions = [
  "What should I do first?",
  "How much revenue is at risk?",
  "Why is this customer the priority?",
];

export default function AskAtlasPanel({
  snapshot,
  memory,
}: AskAtlasPanelProps) {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function submitQuestion(
    requestedQuestion: string
  ) {
    const normalizedQuestion =
      requestedQuestion.trim();

    if (!normalizedQuestion || loading) {
      return;
    }

    setQuestion(normalizedQuestion);
    setLoading(true);
    setAnswer(null);
    setErrorMessage(null);

    try {
      const result = await askAtlas(
        normalizedQuestion,
        snapshot,
        memory
      );

      setAnswer(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Atlas could not answer."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void submitQuestion(question);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
        Ask Atlas
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        Ask about today&apos;s business
      </h2>

      <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
        Atlas answers from the current EMBUR
        intelligence snapshot.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {suggestedQuestions.map(
          (suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() =>
                void submitQuestion(
                  suggestion
                )
              }
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50"
            >
              {suggestion}
            </button>
          )
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          placeholder="Ask Atlas a business question..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={
            loading ||
            question.trim().length === 0
          }
          className="rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Atlas is thinking..."
            : "Ask Atlas"}
        </button>
      </form>
      <p className="mt-2 text-sm text-slate-500">{"Don't type customers' phone numbers or emails."}</p>

      {answer && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Atlas
          </p>

          <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed text-slate-800">
            {answer}
          </p>
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 font-semibold text-red-700">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
