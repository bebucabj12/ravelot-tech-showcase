import type { EventDateTime, ScheduledEvent } from './event-types.js'
import { eventInterval } from './event-date-time.js'

export function findOverlaps(draft: EventDateTime, events: ScheduledEvent[], excludedEventId?: string) {
  const draftInterval = eventInterval(draft)
  if (!draftInterval || draftInterval.end <= draftInterval.start) return []
  return events.filter((event) => {
    const interval = eventInterval(event)
    return event.id !== excludedEventId && interval !== null && draftInterval.start < interval.end && draftInterval.end > interval.start
  })
}
