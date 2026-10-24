import { test } from 'node:test'
import assert from 'node:assert/strict'
import { localDateTimeToInstant, instantToLocalDateTime, eventInterval, classifyEvent, hasValidEventRange, eventCoversDate, isValidTimezone, browserTimezone } from '../src/domain/event-date-time.js'
import { syntheticEvent } from '../examples/synthetic-events.js'

test('native timezone support and browser fallback return a usable IANA zone', () => {
  assert.equal(isValidTimezone('Europe/Amsterdam'), true)
  assert.equal(isValidTimezone('Not/AZone'), false)
  assert.equal(isValidTimezone(browserTimezone()), true)
})

for (const [timezone, time] of [['UTC', '12:00'], ['Europe/Amsterdam', '13:00'], ['America/Argentina/Buenos_Aires', '09:00'], ['Asia/Tokyo', '21:00']]) {
  test('round trip local time and instant: ' + timezone, () => {
    const instant = Date.parse('2024-01-01T12:00:00Z')
    assert.equal(localDateTimeToInstant('2024-01-01', time, timezone), instant)
    assert.deepEqual(instantToLocalDateTime(instant, timezone), { date: '2024-01-01', time })
  })
}

test('overnight event uses the explicit end date', () => {
  const interval = eventInterval(syntheticEvent)!
  assert.equal(new Date(interval.start).toISOString(), '2024-01-01T22:00:00.000Z')
  assert.equal(new Date(interval.end).toISOString(), '2024-01-02T01:00:00.000Z')
  assert.equal(interval.end - interval.start, 3 * 60 * 60 * 1000)
})

test('spring DST gaps are invalid in Amsterdam and New York', () => {
  assert.equal(localDateTimeToInstant('2024-03-31', '02:30', 'Europe/Amsterdam'), null)
  assert.equal(localDateTimeToInstant('2024-03-10', '02:30', 'America/New_York'), null)
})

test('ambiguous fall DST times choose the first occurrence', () => {
  assert.equal(localDateTimeToInstant('2024-10-27', '02:30', 'Europe/Amsterdam'), Date.parse('2024-10-27T00:30:00Z'))
  assert.equal(localDateTimeToInstant('2024-11-03', '01:30', 'America/New_York'), Date.parse('2024-11-03T05:30:00Z'))
})

test('elapsed time across spring DST differs from wall-clock duration', () => {
  const interval = eventInterval({ startDate: '2024-03-31', startTime: '01:30', endDate: '2024-03-31', endTime: '03:30', timezone: 'Europe/Amsterdam' })!
  assert.equal(interval.end - interval.start, 60 * 60 * 1000)
})

test('invalid calendar values, times, timezone and nonzero seconds return null', () => {
  for (const [date, time, timezone] of [
    ['2024-02-30', '12:00', 'UTC'], ['2024-01-01', '24:00', 'UTC'],
    ['2024-01-01', '12:00:01', 'UTC'], ['2024-01-01', '12:00', 'Not/AZone'],
  ]) assert.equal(localDateTimeToInstant(date, time, timezone), null)
  assert.equal(localDateTimeToInstant('2024-01-01', '12:00:00', 'UTC'), Date.parse('2024-01-01T12:00:00Z'))
})

test('status boundaries are deterministic when now is injected', () => {
  const { start, end } = eventInterval(syntheticEvent)!
  assert.equal(classifyEvent(syntheticEvent, start - 1), 'upcoming')
  assert.equal(classifyEvent(syntheticEvent, start), 'ongoing')
  assert.equal(classifyEvent(syntheticEvent, end - 1), 'ongoing')
  assert.equal(classifyEvent(syntheticEvent, end), 'finished')
  assert.equal(classifyEvent(syntheticEvent, NaN), null)
  assert.equal(classifyEvent({ ...syntheticEvent, endDate: syntheticEvent.startDate, endTime: syntheticEvent.startTime }), null)
  assert.equal(classifyEvent({ ...syntheticEvent, startDate: 'invalid' }), null)
})

test('local range check is not a substitute for DST validation', () => {
  const gap = { startDate: '2024-03-31', startTime: '02:30', endDate: '2024-03-31', endTime: '03:30', timezone: 'Europe/Amsterdam' }
  assert.equal(hasValidEventRange(gap), true)
  assert.equal(eventInterval(gap), null)
})

test('calendar coverage includes both date boundaries', () => {
  assert.equal(eventCoversDate(syntheticEvent, '2024-01-01'), true)
  assert.equal(eventCoversDate(syntheticEvent, '2024-01-02'), true)
  assert.equal(eventCoversDate(syntheticEvent, '2024-01-03'), false)
})
