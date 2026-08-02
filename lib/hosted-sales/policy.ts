export const HOSTED_INTERVAL_MS = 15 * 60_000;
export const STALE_RUN_MS = 45 * 60_000;
export const MAX_ATTEMPTS = 5;

export function scheduledKey(date = new Date()) {
  return new Date(Math.floor(date.getTime() / HOSTED_INTERVAL_MS) * HOSTED_INTERVAL_MS).toISOString();
}

export function retryDelayMs(attempt: number) {
  return Math.min(60 * 60_000, 60_000 * 2 ** Math.max(0, attempt - 1));
}

export function isStale(startedAt: Date, now = new Date()) {
  return now.getTime() - startedAt.getTime() >= STALE_RUN_MS;
}

export function isSuppressed(values: string[], candidate: string) {
  const normalized = candidate.trim().toLowerCase();
  return values.some((value) => value.trim().toLowerCase() === normalized);
}
