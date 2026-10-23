export type AtlasBriefLength =
  | "short"
  | "normal"
  | "detailed";

export type AtlasCommunicationPreference =
  | "call"
  | "text"
  | "email";

export interface AtlasMemory {
  ownerName: string;
  preferredBriefLength: AtlasBriefLength;
  preferredCommunication: AtlasCommunicationPreference;
  emergencyFirst: boolean;
  preferredStartHour: number;
  averageResponseMinutes: number;
}

export const defaultAtlasMemory: AtlasMemory = {
  ownerName: "",
  preferredBriefLength: "short",
  preferredCommunication: "call",
  emergencyFirst: true,
  preferredStartHour: 8,
  averageResponseMinutes: 15,
};
