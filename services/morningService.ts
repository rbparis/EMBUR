export type MorningMetric = {
  label: string;
  value: string;
  detail: string;
};

export type MorningPriority = {
  customerName: string;
  service: string;
  opportunityValue: string;
  waitTime: string;
  reason: string;
  action: string;
};

export type MorningBrief = {
  ownerName: string;
  businessStatus: "healthy" | "attention" | "urgent";
  statusMessage: string;
  timeReturnedYesterday: string;
  revenueRecoveredYesterday: string;
  customersHandled: number;
  appointmentsBooked: number;
  priority: MorningPriority;
  metrics: MorningMetric[];
};

const morningBrief: MorningBrief = {
  ownerName: "Mike",
  businessStatus: "healthy",
  statusMessage:
    "One customer needs your attention. Everything else is under control.",
  timeReturnedYesterday: "2h 18m",
  revenueRecoveredYesterday: "$3,250",
  customersHandled: 7,
  appointmentsBooked: 3,
  priority: {
    customerName: "Mike Brown",
    service: "Emergency AC Repair",
    opportunityValue: "$1,250",
    waitTime: "11 hours",
    reason:
      "The customer reported no cooling, has been waiting overnight, and is highly likely to book.",
    action: "Call within 30 minutes",
  },
  metrics: [
    {
      label: "Time Returned",
      value: "2h 18m",
      detail: "Repetitive work EMBUR handled yesterday.",
    },
    {
      label: "Revenue Recovered",
      value: "$3,250",
      detail: "Opportunity value recovered yesterday.",
    },
    {
      label: "Customers Helped",
      value: "7",
      detail: "Customers who received a response or follow-up.",
    },
    {
      label: "Appointments",
      value: "3",
      detail: "Jobs booked while the business kept moving.",
    },
  ],
};

export function getMorningBrief(): MorningBrief {
  return morningBrief;
}