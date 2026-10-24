# Extraction notes

This is a selected extraction with a new repository boundary, not a fork or a copy of the application.

| Original source | Showcase adaptation |
| --- | --- |
| `src/domain/event-date-time.ts` | Temporal function bodies retained. Imports now refer to minimal local contracts. |
| `findOverlaps` in that temporal module | Moved into `src/domain/conflicts.ts`; input types reduced to temporal fields and event ID. Predicate and filtering behavior retained. |
| `src/domain/event.ts` | Replaced by minimal `EventDateTime`, `ScheduledEvent` and `EventCardEvent` contracts. No account, ticket, notes or persistence fields. |
| `src/components/EventCard.tsx` | Rendering and contextual DJ Set condition retained; type and locale import paths adapted to standalone ESM. |
| Global application i18n setup | Replaced by a local instance with an explicit language switch. No storage, browser preference synchronization or backend-error mapping. |
| Full EN/ES resources | Only strings required by these examples selected. |
| Application CSS | Replaced by a small independently written stylesheet. |
| Application test infrastructure | Replaced by Node built-in tests, React server rendering and fictional fixtures. No session or API mocks are required. |

Relative ESM imports include `.js` so compiled output runs directly in Node. JSON resources use import attributes. The build config and package manifest are new and owned by this project.

Formatting and comments may differ at extraction boundaries; algorithmic decisions are not upgraded silently. Known assumptions are listed in the domain documentation.

The date labels in the card retain the source's date-only formatting approach using local noon. Interval calculations use the event's explicit timezone separately.

No original Git history, repository metadata, backend code, production configuration, service credentials or third-party graphics was transferred.
