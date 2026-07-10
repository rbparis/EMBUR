"use client";

import { useEffect, useState } from "react";
import EmburIcon from "@/components/ui/EmburIcon";

type BusinessSettings = {
  businessName: string;
  businessPhone: string;
  openingTime: string;
  closingTime: string;
  afterHoursFollowUp: boolean;
  reviewRequests: boolean;
  ownerNotifications: boolean;
  appointmentConfirmations: boolean;
};

const defaultSettings: BusinessSettings = {
  businessName: "Mike's Heating & Air",
  businessPhone: "(555) 555-1212",
  openingTime: "07:00",
  closingTime: "18:00",
  afterHoursFollowUp: true,
  reviewRequests: true,
  ownerNotifications: true,
  appointmentConfirmations: true,
};

const storageKey = "embur-business-settings";

export default function SettingsScreen() {
  const [settings, setSettings] =
    useState<BusinessSettings>(defaultSettings);

  const [savedSettings, setSavedSettings] =
    useState<BusinessSettings>(defaultSettings);

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(storageKey);

      if (storedSettings) {
        const parsedSettings = JSON.parse(
          storedSettings
        ) as Partial<BusinessSettings>;

        const mergedSettings = {
          ...defaultSettings,
          ...parsedSettings,
        };

        setSettings(mergedSettings);
        setSavedSettings(mergedSettings);
      }
    } catch (error) {
      console.error("Could not load EMBUR settings:", error);
    } finally {
      setIsLoaded(true);
    }
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

  function toggleSetting(
    field: keyof Pick<
      BusinessSettings,
      | "afterHoursFollowUp"
      | "reviewRequests"
      | "ownerNotifications"
      | "appointmentConfirmations"
    >
  ) {
    setSettings((current) => ({
      ...current,
      [field]: !current[field],
    }));

    setSaveMessage("");
  }

  function saveSettings() {
    if (!settings.businessName.trim()) {
      setSaveMessage("Please enter your business name.");
      return;
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(settings)
      );

      setSavedSettings(settings);
      setSaveMessage("Your EMBUR settings have been saved.");

      window.setTimeout(() => {
        setSaveMessage("");
      }, 3500);
    } catch (error) {
      console.error("Could not save EMBUR settings:", error);
      setSaveMessage(
        "We could not save your settings. Please try again."
      );
    }
  }

  function resetSettings() {
    setSettings(defaultSettings);
    setSaveMessage(
      "Defaults restored. Select Save Changes to keep them."
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
              Business controls
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Settings
            </h3>

            <p className="mt-2 max-w-2xl leading-relaxed text-slate-500">
              Control how EMBUR represents your business, follows up
              with customers, and keeps you informed.
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

            {hasChanges ? "Unsaved changes" : "Everything saved"}
          </div>
        </div>

        {!isLoaded ? (
          <SettingsLoading />
        ) : (
          <>
            <div className="mt-8">
              <SettingsSectionHeader
                title="Business profile"
                description="The information EMBUR uses when representing your company."
              />

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <SettingsField
                  label="Business name"
                  value={settings.businessName}
                  placeholder="Mike's Heating & Air"
                  onChange={(value) =>
                    updateTextField("businessName", value)
                  }
                />

                <SettingsField
                  label="Business phone"
                  value={settings.businessPhone}
                  placeholder="(555) 555-1212"
                  type="tel"
                  onChange={(value) =>
                    updateTextField("businessPhone", value)
                  }
                />
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <SettingsSectionHeader
                title="Operating hours"
                description="EMBUR uses these hours to understand when your office is available."
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
                title="Customer communication"
                description="Choose which repetitive customer tasks EMBUR handles."
              />

              <div className="mt-5 space-y-4">
                <SettingToggle
                  title="After-hours follow-up"
                  description="Respond to missed opportunities when the office is closed."
                  enabled={settings.afterHoursFollowUp}
                  onToggle={() =>
                    toggleSetting("afterHoursFollowUp")
                  }
                />

                <SettingToggle
                  title="Appointment confirmations"
                  description="Confirm upcoming appointments and reduce preventable no-shows."
                  enabled={settings.appointmentConfirmations}
                  onToggle={() =>
                    toggleSetting("appointmentConfirmations")
                  }
                />

                <SettingToggle
                  title="Review requests"
                  description="Ask satisfied customers for a review after completed jobs."
                  enabled={settings.reviewRequests}
                  onToggle={() =>
                    toggleSetting("reviewRequests")
                  }
                />
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <SettingsSectionHeader
                title="Owner notifications"
                description="Decide whether EMBUR should alert you when something needs attention."
              />

              <div className="mt-5">
                <SettingToggle
                  title="Priority alerts"
                  description="Notify you when a high-value or urgent customer needs a personal response."
                  enabled={settings.ownerNotifications}
                  onToggle={() =>
                    toggleSetting("ownerNotifications")
                  }
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
                Restore Defaults
              </button>

              <button
                type="button"
                onClick={saveSettings}
                disabled={!hasChanges}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasChanges ? "Save Changes" : "Changes Saved"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white shadow-lg md:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
          Quietly working
        </p>

        <h3 className="mt-3 text-2xl font-bold">
          EMBUR follows your rules.
        </h3>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
          These controls become the foundation for how EMBUR
          communicates, prioritizes work, and protects your time.
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
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
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
        aria-checked={enabled}
        aria-label={`${title}: ${enabled ? "enabled" : "disabled"}`}
        onClick={onToggle}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-7" : "translate-x-1"
          }`}
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