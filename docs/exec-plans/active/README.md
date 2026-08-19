---
document_type: execution-plan-index
lifecycle: current
authority: canonical
owner: taxkit-documentation-owner
last_reviewed: 2026-08-13
review_trigger: active execution-plan admission, lifecycle, dependency, or successor change
successor: null
tombstone: false
---

# Active exec plans

Live implementation plans belong here while work is in progress. Maintainer
lifecycle is owned by [`../../README.md`](../../README.md).

The current deployment goal is owned by the
[`Native Alchemy docs deployment`](./native-alchemy-docs-deployment.md) plan.
It runs the implemented native Website.Vite candidate through the governed
GitHub, Preview, Production, public-journey and teardown procedure.

The completed [`Strict apps and IaC`](../completed/strict-apps-and-iac.md) plan
retains the earlier docs-app runtime and deployment-boundary implementation
history. Its child-process boundary is superseded by the completed
[`Native Alchemy docs integration`](../completed/native-alchemy-docs-integration.md)
plan rather than treated as current architecture.

The Docs Cloudflare and Alchemy deployment SPEC completed all five slices at closeout candidate
`c0cd1a9`; its historical execution plan is retained at
[`../completed/docs-cloudflare-alchemy-deployment.md`](../completed/docs-cloudflare-alchemy-deployment.md).
The earlier unsupported Website.Vite seam, Worker-first asset failure and
beta.64 teardown failures remain retained historical evidence.

Completed harness work is retained under
[`../completed/harness-foundation-improvements.md`](../completed/harness-foundation-improvements.md)
and
[`../completed/harness-governance-documentation.md`](../completed/harness-governance-documentation.md).
The completed docs application migration and its bounded local screenshot
evidence are retained under
[`../completed/docs-application-architecture.md`](../completed/docs-application-architecture.md).
