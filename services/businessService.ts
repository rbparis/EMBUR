export type BusinessMetric = {
  label: string;
  value: string;
  detail: string;
};

const businessMetrics: BusinessMetric[] = [
  {
    label: "Revenue Recovered",
    value: "$18,400",
    detail: "Opportunity value recovered this month.",
  },
  {
    label: "Time Returned",
    value: "43 hours",
    detail: "More than one full work week returned.",
  },
  {
    label: "Appointments Saved",
    value: "22",
    detail: "Jobs that could otherwise have been missed.",
  },
];

export function getBusinessMetrics(): BusinessMetric[] {
  return businessMetrics;
}