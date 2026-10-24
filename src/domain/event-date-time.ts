import type { EventDateTime } from './event-types.js'

export type EventTemporalStatus = 'upcoming' | 'ongoing' | 'finished'
type LocalParts = { year: number; month: number; day: number; hour: number; minute: number }
const formatterCache = new Map<string, Intl.DateTimeFormat>()

function formatter(timezone: string) {
  let value = formatterCache.get(timezone)
  if (!value) {
    value = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    formatterCache.set(timezone, value)
  }
  return value
}

function parseLocalParts(date: string, time: string): LocalParts | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time)
  if (!dateMatch || !timeMatch) return null
const seconds = timeMatch[3] ? Number(timeMatch[3]) : 0

if (seconds !== 0) return null

const parts = {
  year: Number(dateMatch[1]),
  month: Number(dateMatch[2]),
  day: Number(dateMatch[3]),
  hour: Number(timeMatch[1]),
  minute: Number(timeMatch[2]),
}
  const check = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute))
  return check.getUTCFullYear() === parts.year && check.getUTCMonth() === parts.month - 1 && check.getUTCDate() === parts.day && check.getUTCHours() === parts.hour && check.getUTCMinutes() === parts.minute ? parts : null
}

function partsAt(instant: number, timezone: string): LocalParts {
  const values: Partial<Record<Intl.DateTimeFormatPartTypes, number>> = {}
  for (const part of formatter(timezone).formatToParts(new Date(instant))) if (part.type !== 'literal') values[part.type] = Number(part.value)
  return { year: values.year!, month: values.month!, day: values.day!, hour: values.hour!, minute: values.minute! }
}

function partsAsUtc(parts: LocalParts) { return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) }
function sameParts(a: LocalParts, b: LocalParts) { return a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour && a.minute === b.minute }

export function browserTimezone() { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' }
export function isValidTimezone(timezone: string) { try { formatter(timezone).format(); return true } catch { return false } }

// Ambiguous fall-back times resolve to their first occurrence; nonexistent DST times are invalid.
export function localDateTimeToInstant(date: string, time: string, timezone: string): number | null {
  const desired = parseLocalParts(date, time)
  if (!desired || !isValidTimezone(timezone)) return null
  const naive = partsAsUtc(desired)
  const offsets = new Set<number>()
  for (let hours = -36; hours <= 36; hours += 6) {
    const probe = naive + hours * 60 * 60 * 1000
    offsets.add(partsAsUtc(partsAt(probe, timezone)) - probe)
  }
  const matches = [...offsets].map((offset) => naive - offset).filter((candidate) => sameParts(partsAt(candidate, timezone), desired)).sort((a, b) => a - b)
  return matches[0] ?? null
}

export function eventInterval(event: EventDateTime): { start: number; end: number } | null {
  const start = localDateTimeToInstant(event.startDate, event.startTime, event.timezone)
  const end = localDateTimeToInstant(event.endDate, event.endTime, event.timezone)
  return start === null || end === null ? null : { start, end }
}

/** Returns null for invalid dates, times, timezones, ranges, or reference instants.
 * now is epoch milliseconds. Midnight crossings use the explicit endDate.
 */
export function classifyEvent(event: EventDateTime, now: number = Date.now()): EventTemporalStatus | null {
  if (!Number.isFinite(now)) return null

  const interval = eventInterval(event)
  if (!interval || interval.end <= interval.start) return null

  if (now < interval.start) return 'upcoming'
  if (now < interval.end) return 'ongoing'
  return 'finished'
}

export function hasValidEventRange(event: EventDateTime) {
  const start = `${event.startDate}T${event.startTime}`
  const end = `${event.endDate}T${event.endTime}`

  return end > start
}
export function eventCoversDate(event: Pick<EventDateTime, 'startDate' | 'endDate'>, date: string) { return event.startDate <= date && date <= event.endDate }

export function instantToLocalParts(instant: string | number, timezone: string): LocalParts {
  return partsAt(new Date(instant).getTime(), timezone)
}

export function instantToLocalDateTime(instant: string | number, timezone: string) {
  const parts = instantToLocalParts(instant, timezone)

  return {
    date: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`,
    time: `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`,
  }
}
