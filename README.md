# RAVELOT Technical Showcase

**Real scheduling logic. Focused React examples. Documented engineering decisions.**

Selected code from **RAVELOT**, an electronic music event and festival planner.

### Explore the live application

**[Open RAVELOT ? https://ravelot.vercel.app](https://ravelot.vercel.app)**

This repository presents a curated part of the real codebase for technical review. It includes standalone examples of timezone handling, schedule conflicts and contextual event-card presentation. It contains neither the complete application nor its backend.

## Engineering highlights

| Area | What this showcase demonstrates |
| --- | --- |
| Dates and timezones | Local date/time ? absolute instants using IANA zones and native `Intl` |
| Overnight events | Explicit start/end dates instead of inferring midnight crossings |
| Daylight saving time | Documented behavior for nonexistent and ambiguous local times |
| Conflict detection | Absolute interval comparisons, editing exclusions and adjacent events |
| React presentation | A typed `EventCard` whose caller opts into DJ Set presentation |
| Localization | A minimal, isolated English/Spanish translation setup |
| Verification | Strict TypeScript, 34 automated tests and service-independent examples |

The algorithms and card rendering are extracted from RAVELOT. Minimal contracts, isolated localization and independent styling make the selected code executable on its own. [Extraction notes](docs/extraction-notes.md) distinguish preserved logic from adaptations.

## Technology

**Original application:** React, TypeScript, Vite and Supabase.

**This showcase:** React, React DOM, TypeScript, i18next/react-i18next, native `Date`/`Intl`, and Node's built-in test runner. Dependencies are pinned in the manifest and lockfile. No backend SDK, database or API credential is required.

## Architecture

```text
Minimal event contracts
??? Date / Intl conversions
?   ??? Absolute intervals
?       ??? Temporal classification
?       ??? Conflict detection
??? EventCard + isolated EN/ES messages
    ??? React markup
```

The domain has no React, network or persistence dependency. The card receives data and an interaction callback without knowing where events are stored. Examples supply fictional fixtures rather than a backend connection.

### Decisions worth reviewing

- **Keep local intent and timezone explicit.** Event times retain an IANA timezone; conversions produce absolute instants for comparisons.
- **Use explicit overnight boundaries.** An event ending on the next day carries a separate end date.
- **Document DST policies.** Gaps return `null`; ambiguous times choose the first occurrence. These policies and their limits are visible in tests.
- **Compare intervals with strict boundaries.** Consecutive events do not conflict. Editing can exclude the current event by ID.
- **Opt into presentation changes.** The DJ Set variant is enabled by the caller. Stage replaces Venue only for a DJ Set with a nonblank stage; City is omitted in that case. Other contexts preserve Venue + City.
- **Preserve source behavior honestly.** Known assumptions are documented rather than silently redesigned during extraction.

## Read the code

| Entry point | Responsibility |
| --- | --- |
| [Event contracts](src/domain/event-types.ts) | Minimal temporal, scheduled-event and card models |
| [Temporal rules](src/domain/event-date-time.ts) | Conversion, calendar helpers and event status |
| [Conflicts](src/domain/conflicts.ts) | Overlap detection and editing exclusion |
| [EventCard](src/components/EventCard.tsx) | React rendering and contextual DJ Set rule |
| [Localization](src/i18n/index.ts) | Only the messages used by these examples |
| [Examples](examples/run.tsx) | Fictional scenarios and local HTML generation |

## Run the checks

Requires **Node.js 24 or newer** and npm. From this directory:

```sh
npm ci --ignore-scripts
npm run check
```

Installation uses the public npm registry or an existing package cache. After installation, checks and examples work without external services. No `.env`, account, database or production connection is needed.

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm test` | Compile and run the 34 automated tests with network access blocked |
| `npm run examples` | Generate local EN/ES HTML snapshots and print domain examples |
| `npm run audit` | Check publication boundaries and sensitive-data patterns |
| `npm run check` | Run all of the above |

### Preview the component

After `npm run examples`, open either generated file directly in a browser:

- `build/examples/event-card-en.html`
- `build/examples/event-card-es.html`

The snapshots show normal events, stage-only DJ Sets, missing-stage fallback and the default card context. They use inline CSS with no JavaScript, remote fonts or external graphics. Buttons preserve the component's markup but do not navigate in these static snapshots.

Generated files and installed dependencies are excluded from Git.

## Tests and boundaries

The suite covers:

- Timezone round trips and overnight durations.
- DST gaps, ambiguous times and elapsed-time differences.
- Exact status boundaries with an injected reference instant.
- Partial overlap, containment, consecutive events and editing exclusion.
- Cross-timezone conflicts and invalid input handling.
- All DJ Set location variants in EN/ES, without mutating event data.
- Localized labels, React text escaping and blocked network access.

Card tests inspect actual React server-rendered markup. Browser interactions, mobile keyboards and assistive technology are outside this suite's scope. The code retains application-specific temporal assumptions; it is not presented as a universal scheduling library.

## Technical notes

- [Timezone behavior and limitations](docs/timezones.md)
- [Conflict detection and preconditions](docs/conflicts.md)
- [DJ Set presentation](docs/dj-set-presentation.md)
- [Extraction and adaptations](docs/extraction-notes.md)
- [Security and publication boundary](SECURITY.md)

## Scope

This selection excludes authentication, authorization, persistence hooks, Supabase project configuration, database schemas and migrations, Ticketmaster/ADE integrations, full forms, navigation, sharing and the complete application interface.

All event names, artists, locations and IDs in fixtures are fictional. No real schedules, private Git history or third-party graphics are included. The live application link is provided for context; the showcase does not connect to it.

## Copyright and rights

Copyright ? 2026 RAVELOT. All rights reserved.

This public repository is a technical portfolio. No open-source license or additional permission to reuse its original code is granted. Third-party dependencies remain subject to their respective licenses.

The package is marked `private` and `UNLICENSED`; no npm publication or deployment is configured.
