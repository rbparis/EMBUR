/** Without a valid viewer timezone, never fall back to server-local time. */
export function viewerGreeting(ownerName: string | null | undefined, timeZone?: string, now = new Date()): string {
  if (!timeZone) return "";
  let hour: number;
  try {
    hour = Number(new Intl.DateTimeFormat("en-US", {
      timeZone, hour: "numeric", hourCycle: "h23",
    }).format(now));
  } catch {
    return "";
  }
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = ownerName?.trim();
  return name ? `${greeting}, ${name}.` : `${greeting}.`;
}
