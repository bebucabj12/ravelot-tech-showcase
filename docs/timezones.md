# Timezones and event intervals

## Preserved representation

An event contains local `startDate`, `startTime`, `endDate`, `endTime` and an explicit IANA `timezone`. Dates are zero-padded ISO-style calendar strings. Overnight events use the next date explicitly; an earlier end time never silently implies tomorrow.

The showcase includes no storage adapter. `localDateTimeToInstant` returns epoch milliseconds, while `instantToLocalDateTime` returns local date/time strings.

## Conversion strategy

The original implementation uses `Intl.DateTimeFormat.formatToParts` to inspect local parts at candidate instants. It probes offsets around the requested time, keeps candidates whose local parts match, sorts them, and selects the earliest. Formatters are cached by timezone.

This preserves the application's algorithm instead of replacing it with a new timezone library.

## DST policy

- A nonexistent local time during a spring-forward gap returns `null`.
- An ambiguous fall-back time resolves to its **first occurrence**.
- Duration and conflict checks use converted instants rather than subtracting wall-clock strings.

Historical test example:

```ts
localDateTimeToInstant('2024-03-31', '02:30', 'Europe/Amsterdam')
// null: this local time did not occur

localDateTimeToInstant('2024-10-27', '02:30', 'Europe/Amsterdam')
// 2024-10-27T00:30:00.000Z: the first occurrence
```

An Amsterdam event from 01:30 to 03:30 on 2024-03-31 lasts one elapsed hour.

## Validation boundaries

- `isValidTimezone` checks the runtime's timezone support.
- `eventInterval` returns `null` for unconvertible boundaries; it does not independently enforce a positive duration.
- `classifyEvent` also checks positive duration and permits an injected reference instant for deterministic tests.
- `hasValidEventRange` is a local string comparison, not full date or DST validation.
- `eventCoversDate` includes both calendar dates, even if the interval ends at midnight. It is a calendar helper, not the conflict predicate.
- `instantToLocalDateTime` assumes a valid instant and timezone; it is not an untrusted-input parser.

## Known limits retained from the source

Input precision is minutes; seconds are accepted only when zero. The algorithm samples offsets over a bounded window and is intended for ordinary event schedules, not exhaustive historical calendar analysis. The `Date.UTC` treatment of years 0–99 is not compensated for. Runtime timezone data can differ or become outdated. Tests use modern historical dates and explicit zones, not the machine's current timezone.

The formatter cache is not size-bounded. Calling these helpers on arbitrary, unlimited external timezone inputs would require a separate resource policy.

These are documented limits, not silent behavioral changes made during extraction.
