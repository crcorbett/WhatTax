---
document_type: execution-plan-index
lifecycle: current
authority: canonical
owner: taxkit-documentation-owner
last_reviewed: 2026-08-20
review_trigger: active execution-plan admission, lifecycle, dependency, or successor change
successor: null
tombstone: false
---

# Active exec plans

Live implementation plans belong here while work is in progress. Maintainer
lifecycle is owned by [`../../README.md`](../../README.md).

There are no active execution plans. New implementation work requires an
admitted SPEC, task list and plan before changes begin.

The implemented
[Pull-request Turbo Write-through Cache](../../product-specs/pull-request-turbo-write-through.md)
SPEC and [completed plan](../completed/pull-request-turbo-write-through.md)
retain exact same-commit hosted write/read proof for token-bearing pull
requests, secret-free fork fallback and live frozen installation. The earlier
cache implementation history remains in the
[`completed predecessor plan`](../completed/ci-cache-efficiency.md). No CI
cache execution plan is active. The completed
[Shared Dependency Cache and Checkout Upgrade](../completed/shared-dependency-cache-and-checkout.md)
plan retains the successor key-scope and checkout-v7 proof.

The completed deployment goal is retained in the
[`Native Alchemy docs deployment`](../completed/native-alchemy-docs-deployment.md)
plan. It records the implemented native Website.Vite candidate through the
governed GitHub, Preview, Production, public-journey and teardown procedure.

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
