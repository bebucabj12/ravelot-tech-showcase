import type { EventCardEvent } from '../src/domain/event-types.js'

/** Entirely fictional. Not exported from the application's database. */
export const syntheticEvent: EventCardEvent = {
  id: 'example-performance',
  name: 'Fictional Night',
  artist: 'Example Artist',
  startDate: '2024-01-01',
  startTime: '23:00',
  endDate: '2024-01-02',
  endTime: '02:00',
  timezone: 'Europe/Amsterdam',
  venue: 'Example Hall',
  city: 'Example City',
  stage: 'Example Stage',
  isDjSet: true,
}
