# Contextual DJ Set presentation

The component preserves the source rule:

```ts
const showingStage =
  showDjSetStage && event.isDjSet && event.stage.trim().length > 0
const location = showingStage ? event.stage : event.venue
```

City is appended only when `showingStage` is false.

| Caller enables variant | DJ Set | Stage | Location |
| --- | --- | --- | --- |
| No | Any | Any | Venue + City |
| Yes | No | Any | Venue + City |
| Yes | Yes | Nonblank | Stage only |
| Yes | Yes | Empty or whitespace | Venue + City |

The original Upcoming view opts into this variant. Other contexts keep the prop's default `false`; the showcase illustrates that decision without copying Upcoming or other product screens.

## Why this boundary matters

The event's classification is data. The decision to show a stage belongs to a particular presentation context. An explicit opt-in prevents a shared card from changing unrelated views.

`trim()` tests whether stage contains useful content. It does not rewrite or clear the stored stage, venue or city. The component does not persist anything.

The artist/name hierarchy, times, overnight labels and active-day label are preserved. Locale changes affect date formatting and translated labels, not fictional event content.

## Localization and styling adaptations

Only the two card messages and the label `DJ Set` were selected from EN/ES resources. `DJ Set` stays the same in both languages. No account, backend-error or environment-related translations are included.

The CSS is new, neutral and scoped beneath `.showcase`. It illustrates the component without reproducing the application's full themes or graphics.

The tests inspect server-rendered markup. Review the generated local snapshots for layout; browser interaction and screen-reader behavior are not asserted by those tests.
