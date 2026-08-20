---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-execution-history-owner
last_reviewed: 2026-08-20
review_trigger: SDC task, workflow, cache scope, checkout pin, hosted proof, rollback, or successor change
successor: ../../product-specs/shared-dependency-cache-and-checkout.md
tombstone: false
---

# Shared Dependency Cache and Checkout Upgrade Execution Plan

Spec: [Shared Dependency Cache and Checkout Upgrade](../../product-specs/shared-dependency-cache-and-checkout.md)

Task list:
[`shared-dependency-cache-and-checkout.tasks.json`](../../product-specs/shared-dependency-cache-and-checkout.tasks.json)

## Outcome

All five workflows now use content-addressed Bun-package keys, and the three
browser workflows use content-addressed Chromium keys. GitHub ref scope keeps
writes isolated while allowing matching default-branch restores. Every
workflow pins checkout v7.0.1 to
`3d3c42e5aac5ba805825da76410c181273ba90b1`. Frozen Bun installation,
Playwright installation, the complete Quality graph and all provider/proof
commands remain live.

## Proof

- Source commit: `05fc7328db6d9468c0e616d498155213f4357b03`.
- Pull request: `#59`.
- Quality run `32357219491`, attempt 1: checkout v7 passed; both new keys
  missed, were populated after live installation, and the job passed in 3m29s.
- Exact attempt 2: both keys hit, both saves skipped, frozen Bun install took
  two seconds, Playwright's live setup took 12 seconds, and the job passed in
  54 seconds.
- Full local `bun run verification`, focused policy and docs-deployment checks
  passed.
- Detailed receipt:
  [`SDC-hosted-proof.md`](../../documentation-audit/shared-dependency-cache-and-checkout/SDC-hosted-proof.md).

No Changeset is required because this changes CI policy and maintainer
documentation only.

## Risk, recovery and non-claims

The cache paths contain package downloads and Chromium binaries only. They do
not contain `node_modules`, secrets, provider state or receipts. Rollback
restores event-name keys or removes dependency-cache steps while preserving
live installs and every command. Checkout rollback restores the previous full
SHA.

The attempts prove same-ref cache creation/reuse and checkout compatibility.
They do not prove a future pull-request restore from `main`, general savings,
deployment, teardown, provider state, release, publication or public
availability.
