"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  defaultAtlasMemory,
  type AtlasBriefLength,
  type AtlasCommunicationPreference,
  type AtlasMemory,
} from "@/lib/intelligence/memory/types";
import {
  fetchAtlasMemory,
  updateAtlasMemory,
} from "@/services/atlasMemoryApi";

type LoadStatus =
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error";

export default function AtlasMemorySettings() {
  const [memory, setMemory] =
    useState<AtlasMemory>(
      defaultAtlasMemory
    );

  const [status, setStatus] =
    useState<LoadStatus>("loading");

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMemory() {
      try {
        const storedMemory =
          await fetchAtlasMemory();

        if (!active) {
          return;
        }

        setMemory(storedMemory);
        setStatus("ready");
      } catch (error) {
        console.error(
          "Failed to load Atlas preferences:",
          error
        );

        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(
          "Atlas preferences could not be loaded."
        );
      }
    }

    void loadMemory();

    return () => {
      active = false;
    };
  }, []);

  function updateField<K extends keyof AtlasMemory>(
    field: K,
    value: AtlasMemory[K]
  ) {
    setMemory((current) => ({
      ...current,
      [field]: value,
    }));

    setStatus("ready");
    setMessage(null);
  }

  async function saveMemory() {
    setStatus("saving");
    setMessage(null);

    try {
      const savedMemory =
        await updateAtlasMemory(memory);

      setMemory(savedMemory);
      setStatus("saved");
      setMessage(
        "Atlas preferences saved. The workspace will refresh."
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (error) {
      console.error(
        "Failed to save Atlas preferences:",
        error
      );

      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Atlas preferences could not be saved."
      );
    }
  }

  if (status === "loading") {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="font-semibold text-slate-500">
          Loading Atlas preferences...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
        Atlas Memory
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        How Atlas should work with you
      </h2>

      <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
        These preferences shape Atlas priorities,
        recommendations, and future morning briefs.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field label="Owner name">
          <input
            placeholder="Your name (optional)"
            value={memory.ownerName}
            onChange={(event) =>
              updateField(
                "ownerName",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </Field>

        <Field label="Preferred communication">
          <select
            value={
              memory.preferredCommunication
            }
            onChange={(event) =>
              updateField(
                "preferredCommunication",
                event.target
                  .value as AtlasCommunicationPreference
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            <option value="call">
              Phone call
            </option>
            <option value="text">
              Text message
            </option>
            <option value="email">
              Email
            </option>
          </select>
        </Field>

        <Field label="Morning brief length">
          <select
            value={
              memory.preferredBriefLength
            }
            onChange={(event) =>
              updateField(
                "preferredBriefLength",
                event.target
                  .value as AtlasBriefLength
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            <option value="short">
              Short
            </option>
            <option value="normal">
              Normal
            </option>
            <option value="detailed">
              Detailed
            </option>
          </select>
        </Field>

        <Field label="Preferred start hour">
          <input
            type="number"
            min={0}
            max={23}
            value={
              memory.preferredStartHour
            }
            onChange={(event) =>
              updateField(
                "preferredStartHour",
                Number(event.target.value)
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Use 24-hour time. Example: 8 means
            8:00 AM.
          </p>
        </Field>

        <Field label="Expected response time">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={1440}
              value={
                memory.averageResponseMinutes
              }
              onChange={(event) =>
                updateField(
                  "averageResponseMinutes",
                  Number(event.target.value)
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              minutes
            </span>
          </div>
        </Field>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <label className="flex cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              checked={memory.emergencyFirst}
              onChange={(event) =>
                updateField(
                  "emergencyFirst",
                  event.target.checked
                )
              }
              className="mt-1 h-5 w-5 rounded border-slate-300"
            />

            <span>
              <span className="block font-bold text-slate-950">
                Prioritize emergencies first
              </span>

              <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                Atlas adds priority weight to
                emergency, no-cooling, and no-heat
                requests.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={saveMemory}
          disabled={status === "saving"}
          className="rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving"
            ? "Saving Atlas Memory..."
            : "Save Atlas Preferences"}
        </button>

        {message && (
          <p
            className={`text-sm font-semibold ${
              status === "error"
                ? "text-red-700"
                : "text-green-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}
