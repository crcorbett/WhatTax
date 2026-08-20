---
document_type: execution-plan
lifecycle: active
authority: supporting
owner: taxkit-execution-owner
last_reviewed: 2026-08-20
review_trigger: PWC task, workflow policy, cache authority, hosted run, or lifecycle change
successor: ../../product-specs/pull-request-turbo-write-through.md
tombstone: false
---

# Pull-request Turbo Write-through Cache Execution Plan

Spec: [Pull-request Turbo Write-through Cache](../../product-specs/pull-request-turbo-write-through.md)

Task list:
[`pull-request-turbo-write-through.tasks.json`](../../product-specs/pull-request-turbo-write-through.tasks.json)

## Active outcome

PWC-001 changes same-repository Quality pull requests from Vercel Remote Cache
read-only to read/write. Fork pull requests remain secret-free and use the full
local fallback. The existing Bun-download and Chromium caches remain separate;
`node_modules` stays live and uncached.

## Work and proof order

1. Update the workflow, Schema-backed policy, negative fixtures, controls and
   automation authority.
2. Update current architecture, standards, authority, recovery and lifecycle
   owners without rewriting predecessor evidence.
3. Run focused checks, empty-token fallback, docs/runbook checks and the full
   repository verification graph.
4. Open the pull request, record one cacheable pull-request write, rerun the
   exact revision and record its remote hit.
5. Close the task and move this plan to completed only after claim-matched
   hosted evidence is retained.

No Changeset is required because this changes CI policy and maintainer
documentation only. It does not change a package, API, SDK, app runtime or
public contract.

## Stop, rollback and non-claims

Stop if the workflow needs `pull_request_target`, a fork receives the token,
repository permissions expand, the uncached graph changes, or a live install
is skipped. Rollback restores pull requests to remote read-only or removes the
remote bindings while retaining every Quality command. Cache logs do not prove
release, deployment, provider state, publication or public availability.
