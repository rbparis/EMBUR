export type LeadStatus =
  | "new"
  | "waiting"
  | "contacted"
  | "follow_up"
  | "booked"
  | "completed"
  | "invoiced"
  | "paid"
  | "lost"
  | "Booked"
  | "Follow-up Sent"
  | "Waiting";

export interface Lead {
  id: string | number;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  service: string;
  status: LeadStatus | string;
  value: string;
  estimatedValue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface ActivityItem {
  id: number;
  text: string;
}

export interface SettingItem {
  id: number;
  label: string;
}
