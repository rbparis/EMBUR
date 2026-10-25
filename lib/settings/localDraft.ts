export type BusinessSettings = {
  businessName: string;
  businessPhone: string;
  openingTime: string;
  closingTime: string;
  afterHoursFollowUp: boolean;
  reviewRequests: boolean;
  ownerNotifications: boolean;
  appointmentConfirmations: boolean;
};

export const defaultSettings: BusinessSettings = {
  businessName: "", businessPhone: "", openingTime: "", closingTime: "",
  afterHoursFollowUp: false, reviewRequests: false,
  ownerNotifications: false, appointmentConfirmations: false,
};
export const storageKey = "embur-business-settings";
const legacyDefaults: BusinessSettings = {
  businessName: "Mike's Heating & Air", businessPhone: "(555) 555-1212",
  openingTime: "07:00", closingTime: "18:00",
  afterHoursFollowUp: true, reviewRequests: true,
  ownerNotifications: true, appointmentConfirmations: true,
};

/** Only the complete, untouched legacy sample permits clearing the old hours. */
export function normalizeLocalDraft(input: unknown): BusinessSettings {
  const parsed = input && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown> : {};
  const untouched = Object.keys(parsed).length === Object.keys(legacyDefaults).length &&
    Object.entries(legacyDefaults).every(([key, value]) => parsed[key] === value);
  const text = (key: keyof BusinessSettings) => typeof parsed[key] === "string" ? parsed[key] as string : "";
  return {
    ...parsed,
    businessName: parsed.businessName === legacyDefaults.businessName ? "" : text("businessName"),
    businessPhone: parsed.businessPhone === legacyDefaults.businessPhone ? "" : text("businessPhone"),
    openingTime: untouched ? "" : text("openingTime"),
    closingTime: untouched ? "" : text("closingTime"),
    afterHoursFollowUp: false, reviewRequests: false,
    ownerNotifications: false, appointmentConfirmations: false,
  };
}

type DraftStorage = Pick<Storage, "getItem" | "setItem">;
export function readLocalDraft(storage: DraftStorage): BusinessSettings {
  const raw = storage.getItem(storageKey);
  if (!raw) return { ...defaultSettings };
  const draft = normalizeLocalDraft(JSON.parse(raw));
  const normalized = JSON.stringify(draft);
  if (normalized !== raw) storage.setItem(storageKey, normalized);
  return draft;
}
export function saveLocalDraft(storage: DraftStorage, input: BusinessSettings): BusinessSettings {
  const draft = normalizeLocalDraft(input);
  storage.setItem(storageKey, JSON.stringify(draft));
  return draft;
}
