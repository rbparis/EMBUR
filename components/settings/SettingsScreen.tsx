"use client";

import { useEffect, useState } from "react";
import EmburIcon from "@/components/ui/EmburIcon";

import Link from "next/link";
import { defaultSettings, readLocalDraft, saveLocalDraft, type BusinessSettings } from "@/lib/settings/localDraft";

export default function SettingsScreen() {
  const [settings, setSettings] =
    useState<BusinessSettings>(defaultSettings);

  const [savedSettings, setSavedSettings] =
    useState<BusinessSettings>(defaultSettings);

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const storedSettings = readLocalDraft(window.localStorage);
        setSettings(storedSettings);
        setSavedSettings(storedSettings);
      } catch {
        setSaveMessage("Could not save this local draft. Check your browser storage settings and try again.");
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, []);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  function updateTextField(
    field: keyof Pick<
      BusinessSettings,
      | "businessName"
      | "businessPhone"
      | "openingTime"
      | "closingTime"
    >,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaveMessage("");
  }

  function saveSettings() {
    try {
      const draft = saveLocalDraft(window.localStorage, settings);
      setSettings(draft);
      setSavedSettings(draft);
      setSaveMessage("Draft saved in this browser only. Your saved business profile and live services have not changed.");

      window.setTimeout(() => {
        setSaveMessage("");
      }, 3500);
    } catch (error) {
      console.error("Could not save EMBUR settings:", error);
      setSaveMessage(
        "Could not save this local draft. Check your browser storage settings and try again."
      );
    }
  }

  function resetSettings() {
    setSettings(defaultSettings);
    setSaveMessage(
      "Local draft reset. Select Save local draft to store these blank defaults."
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              Local preferences
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Draft preferences
            </h3>

            <p className="mt-2 max-w-2xl leading-relaxed text-slate-500">
              These draft preferences are stored in this browser only. They do not update your saved business profile or activate any automated service.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              hasChanges
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                hasChanges ? "bg-amber-500" : "bg-green-500"
              }`}
            />

            {hasChanges ? "Unsaved local changes" : "No unsaved local changes"}
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">Local draft only. Information saved here stays in this browser and may not appear on another device. Automated services are not activated by these settings.</p>
        <Link href="/app/onboarding" className="mt-4 inline-block font-semibold text-blue-700 underline">Edit saved business profile</Link>

        {!isLoaded ? (
          <SettingsLoading />
        ) : (
          <>
            <div className="mt-8">
              <SettingsSectionHeader
                title="Draft business details"
                description="These fields are local notes only. To change the business name, phone, industry, or timezone stored in your EMBUR workspace, use Business setup."
              />

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <SettingsField
                  label="Business name"
                  value={settings.businessName}
                  placeholder="Business name"
                  onChange={(value) =>
                    updateTextField("businessName", value)
                  }
                />

                <SettingsField
                  label="Business phone"
                  value={settings.businessPhone}
                  placeholder="Business phone number"
                  type="tel"
                  onChange={(value) =>
                    updateTextField("businessPhone", value)
                  }
                />
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <SettingsSectionHeader
                title="Draft operating hours"
                description="These hours are local notes only. They do not control calling, booking, or messaging."
              />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <SettingsField
                  label="Office opens"
                  value={settings.openingTime}
                  type="time"
                  onChange={(value) =>
                    updateTextField("openingTime", value)
                  }
                />

                <SettingsField
                  label="Office closes"
                  value={settings.closingTime}
                  type="time"
                  onChange={(value) =>
                    updateTextField("closingTime", value)
                  }
                />
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <SettingsSectionHeader
                title="Non-live communication features"
                description="These features are not live. Their controls are disabled and cannot activate communications."
              />

              <div className="mt-5 space-y-4">
                <SettingToggle
                  title="After-hours follow-up — Not live"
                  description="Automated follow-up is not available. This setting cannot send messages."
                />

                <SettingToggle
                  title="Appointment confirmations — Not live"
                  description="Automated appointment confirmations are not available."
                />

                <SettingToggle
                  title="Review requests — Not live"
                  description="Automated review requests are not available."
                />
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <SettingsSectionHeader
                title="Non-live notifications"
                description="Automatic owner notifications are not live. The control below is disabled."
              />

              <div className="mt-5">
                <SettingToggle
                  title="Priority alerts — Not live"
                  description="Automatic priority notifications are not available."
                />
              </div>
            </div>

            {saveMessage && (
              <div
                role="status"
                className={`mt-8 flex items-center gap-3 rounded-2xl border px-5 py-4 font-semibold ${
                  saveMessage.includes("saved")
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-blue-200 bg-blue-50 text-blue-800"
                }`}
              >
                <EmburIcon name="check" size={20} />
                {saveMessage}
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={resetSettings}
                className="rounded-xl border bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset local draft
              </button>

              <button
                type="button"
                onClick={saveSettings}
                disabled={!hasChanges}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasChanges ? "Save local draft" : "Local draft saved"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-lg md:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
          Local draft only
        </p>

        <h3 className="mt-3 text-2xl font-bold">
          These preferences do not operate live services.
        </h3>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
          This section stores reference preferences in your browser. It does not enable automated communications or change your saved business profile.
        </p>
      </div>
    </section>
  );
}

function SettingsField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "tel" | "time";
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
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-4 text-slate-950 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function SettingToggle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <p className="font-bold text-slate-950">{title}</p>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        disabled
        aria-checked={false}
        aria-label={title}
        className="relative h-8 w-14 shrink-0 rounded-full bg-slate-300 transition-colors duration-200"
      >
        <span
          className="absolute top-1 h-6 w-6 translate-x-1 rounded-full bg-white shadow-sm transition-transform duration-200"
        />
      </button>
    </div>
  );
}

function SettingsSectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h4 className="text-xl font-bold text-slate-950">{title}</h4>

      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SettingsLoading() {
  return (
    <div className="mt-8 space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-24 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}