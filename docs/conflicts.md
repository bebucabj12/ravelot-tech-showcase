# Conflict detection

The original overlap predicate is preserved:

```ts
draft.start < candidate.end && draft.end > candidate.start
```

Both intervals are absolute instants derived from their own local dates, times and IANA timezone.

## Consequences

- Partial overlap, containment and identical intervals conflict.
- A candidate ending exactly when the draft starts does not conflict.
- A candidate starting exactly when the draft ends does not conflict.
- Different local clock values can overlap after timezone conversion.
- Overnight events can conflict with the following calendar day's events.
- `excludedEventId` removes the event currently being edited without excluding other events at the same time.

No festival, stage, city or DJ Set exception is involved. The function returns references to matching input objects and does not modify them.

## Preconditions and limits

An unconvertible or non-positive draft yields no matches. Unconvertible existing intervals are skipped. As in the original code, existing events are assumed to have valid positive ranges: the predicate does not independently reject every reversed candidate interval. A production caller must validate those events at its input boundary.

There is no recurring-event expansion, travel-time allowance, cancellation handling or spatial policy.

The function scans the existing collection for each query, with conversion work per candidate. It is suitable for explaining the application's small-collection approach; it is not an indexed scheduling engine.
