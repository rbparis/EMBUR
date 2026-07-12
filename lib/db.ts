// lib/db.ts

export type DatabaseStatus =
  | "disconnected"
  | "connecting"
  | "connected";

export const database = {
  status: "disconnected" as DatabaseStatus,
};