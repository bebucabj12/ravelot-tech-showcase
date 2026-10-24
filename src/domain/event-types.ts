/** Minimal standalone contracts; no persistence or account fields. */
export type EventDateTime = {
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  timezone: string
}

export type ScheduledEvent = EventDateTime & { id: string }

export type EventCardEvent = ScheduledEvent & {
  name: string
  artist: string
  venue: string
  city: string
  stage: string
  isDjSet: boolean
}
