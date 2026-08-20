---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-execution-plan-owner
last_reviewed: 2026-08-20
review_trigger: SDC task, workflow, cache scope, checkout pin, verification, hosted proof, or lifecycle change
successor: ../../product-specs/shared-dependency-cache-and-checkout.md
tombstone: false
---

# Shared Dependency Cache and Checkout Upgrade Execution Plan

Spec: [Shared Dependency Cache and Checkout Upgrade](../../product-specs/shared-dependency-cache-and-checkout.md)

Task list:
[`shared-dependency-cache-and-checkout.tasks.json`](../../product-specs/shared-dependency-cache-and-checkout.tasks.json)

## Accepted outcome

Pull requests can restore matching default-branch Bun package and Chromium
caches, while GitHub ref scope keeps their writes away from `main` and sibling
pull requests. Every workflow uses the exact checkout v7.0.1 SHA. Frozen Bun
installation, Playwright installation, the complete Quality graph and all
provider/proof commands remain live.

## Progress

| Task | Status | Evidence |
| --- | --- | --- |
| SDC-001 | Complete | All five workflows use content-only keys; Quality policy, 18 Quality tests, 57 deployment tests and the deployment automation check pass. |
| SDC-002 | In progress | Official v7.0.1 tag resolves to `3d3c42e5aac5ba805825da76410c181273ba90b1`; focused policy accepts all five pins, while full local and hosted proof remain. |

## Authority and stop conditions

Cooper approved the SPEC implementation. This permits repository workflow,
policy, documentation, commit, push and hosted pull-request verification for
the named branch. It does not permit deployment, teardown approval, provider
mutation, release or publication. Stop if a workflow source identity changes,
a cache path could contain secrets or installed dependencies, a live command
is skipped, or checkout v7 cannot run on the GitHub-hosted Quality runner.

## Verification and closeout

Run focused Quality and docs-deployment workflow checks first, then the docs,
runbook, repository-path and full verification gates. Push one immutable
candidate and retain the exact pull request, commit, run, cache keys, checkout
version, timing, limitations and non-claims. No Changeset is required because
no package or consumer contract changes.
