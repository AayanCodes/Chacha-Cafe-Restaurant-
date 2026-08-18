/**
 * Timezone & Date Helper Utilities for Chacha Cafe CMS
 * Supports Asia/Kolkata timezone calculations
 */

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Gets the current date string (YYYY-MM-DD) in the target timezone
 */
export function getTodayDateString(timezone: string = DEFAULT_TIMEZONE): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch (err) {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }
}

/**
 * Gets today's day of the week in target timezone (0 = Sunday, 6 = Saturday)
 */
export function getTodayDayOfWeek(timezone: string = DEFAULT_TIMEZONE): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'narrow',
    });
    const now = new Date();
    return now.getDay();
  } catch (err) {
    return new Date().getDay();
  }
}

/**
 * Checks if today in target timezone is Saturday or Sunday
 */
export function isTodayWeekend(timezone: string = DEFAULT_TIMEZONE): { isSaturday: boolean; isSunday: boolean } {
  const day = getTodayDayOfWeek(timezone);
  return {
    isSaturday: day === 6,
    isSunday: day === 0,
  };
}

export type OfferStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED' | 'INACTIVE_DAY' | 'ARCHIVED';

export interface OfferScheduleRule {
  is_active: boolean;
  is_archived?: boolean;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  saturday_enabled: boolean;
  sunday_enabled: boolean;
}

/**
 * Computes the real-time calculated status of a special offer based on date ranges and days of week.
 */
export function computeOfferStatus(offer: OfferScheduleRule, timezone: string = DEFAULT_TIMEZONE): OfferStatus {
  if (offer.is_archived) {
    return 'ARCHIVED';
  }

  if (!offer.is_active) {
    return 'PAUSED';
  }

  const todayStr = getTodayDateString(timezone);

  if (todayStr < offer.start_date) {
    return 'SCHEDULED';
  }

  if (todayStr > offer.end_date) {
    return 'EXPIRED';
  }

  // Currently within valid start and end dates
  const { isSaturday, isSunday } = isTodayWeekend(timezone);

  // If both Saturday and Sunday are false, the offer runs all week
  const isWeekendOnly = offer.saturday_enabled || offer.sunday_enabled;

  if (!isWeekendOnly) {
    return 'ACTIVE';
  }

  const matchesDay = (offer.saturday_enabled && isSaturday) || (offer.sunday_enabled && isSunday);

  if (matchesDay) {
    return 'ACTIVE';
  }

  return 'INACTIVE_DAY';
}

/**
 * Evaluates whether an offer should be publicly visible on the live site right now.
 */
export function isOfferPubliclyVisible(offer: OfferScheduleRule, timezone: string = DEFAULT_TIMEZONE): boolean {
  const status = computeOfferStatus(offer, timezone);
  return status === 'ACTIVE';
}
