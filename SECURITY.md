# Security and publication boundary

This public technical portfolio contains selected scheduling and presentation code from RAVELOT. It has no backend connection, account model, authentication, authorization, persistence client, SQL migrations or external event-search integration.

## Data and execution

All examples and test fixtures are fictional. Do not add real schedules, user information, browser sessions, credentials or private project configuration.

No environment file is required. Tests and example generation preload a network blocker. Generated HTML uses inline CSS, no JavaScript or remote assets, and a restrictive content security policy.

Installing dependencies may require the public npm registry. The source, tests and examples do not contact the live RAVELOT application or any external service.

## What belongs in this repository

- Selected domain and presentation source.
- Fictional examples and independent tests.
- Technical documentation and the showcase's own configuration.
- A pinned dependency manifest and lockfile.

Environment files, generated output, installed dependencies, screenshots, private repository metadata and backend configuration are outside the publication boundary. The private application's Git history is not included.

## Reporting a concern

If a security-reporting channel is available on the hosting platform, use a private report. Do not include secrets, personal data or details of a suspected production issue in a public issue.

The live application link in the README is provided only as product context. This showcase does not authorize testing against production systems.

## Rights and third-party code

The original showcase code is published for technical presentation with all rights reserved. No open-source license or additional reuse permission is granted. Dependencies retain their own licenses; this statement does not change third-party terms.

## Verification limits

Run `npm run check` before preparing a release. The included pattern scanner checks file boundaries and common secret formats; it is not a complete secret-detection system or security certification.

The default verification is offline. It does not retrieve current dependency advisories. Dependencies should receive a separate advisory review before publication or later updates.

Public source can be inspected and copied technically; a rights notice is not an access-control mechanism. Keep sensitive implementation and configuration outside this repository.
