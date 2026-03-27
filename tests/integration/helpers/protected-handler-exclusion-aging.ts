export const PROTECTED_HANDLER_EXCLUSION_NEAR_DUE_DAYS = 14;

export function parseIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function startOfUtcToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function diffInDays(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}

export function isNearDue(reviewBy: string, thresholdDays: number): boolean {
  const today = startOfUtcToday();
  const target = parseIsoDate(reviewBy);
  const daysUntil = diffInDays(today, target);

  return daysUntil >= 0 && daysUntil <= thresholdDays;
}
