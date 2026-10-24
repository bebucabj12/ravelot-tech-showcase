import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findOverlaps } from '../src/domain/conflicts.js'
import type { ScheduledEvent } from '../src/domain/event-types.js'

const draft = { startDate: '2024-01-01', endDate: '2024-01-01', startTime: '22:00', endTime: '23:00', timezone: 'UTC' }
const event = (id: string, startTime: string, endTime: string): ScheduledEvent => ({ ...draft, id, startTime, endTime })

test('partial, contained and containing intervals conflict', () => {
  const events = [event('partial', '22:30', '23:30'), event('contained', '22:10', '22:20'), event('containing', '21:00', '23:30')]
  assert.deepEqual(findOverlaps(draft, events), events)
})

test('consecutive intervals touching either boundary do not conflict', () => {
  assert.deepEqual(findOverlaps(draft, [event('before', '21:00', '22:00'), event('after', '23:00', '23:30')]), [])
})

test('editing excludes the current event by ID without excluding other matches', () => {
  const self = event('editing', '22:00', '23:00')
  const other = event('other', '22:00', '23:00')
  assert.deepEqual(findOverlaps(draft, [self, other], 'editing'), [other])
})

test('different local representations compare as absolute instants', () => {
  const other = { ...draft, id: 'other-zone', timezone: 'Europe/Amsterdam', startTime: '23:30', endDate: '2024-01-02', endTime: '00:30' }
  assert.deepEqual(findOverlaps(draft, [other]), [other])
})

test('overnight intervals can conflict on the following date', () => {
  const overnight = { ...draft, startTime: '23:00', endDate: '2024-01-02', endTime: '02:00' }
  const nextDay = { ...event('following-day', '01:00', '03:00'), startDate: '2024-01-02', endDate: '2024-01-02' }
  assert.deepEqual(findOverlaps(overnight, [nextDay]), [nextDay])
})

test('invalid drafts and unparseable existing intervals are handled without mutation', () => {
  const valid = Object.freeze(event('valid', '22:15', '22:45'))
  const invalid = { ...valid, id: 'invalid', startDate: 'invalid' }
  assert.deepEqual(findOverlaps({ ...draft, endTime: '21:00' }, [valid]), [])
  assert.deepEqual(findOverlaps(draft, [invalid, valid]), [valid])
  assert.equal(valid.startTime, '22:15')
})
