---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: TCC-004 workflow, Turbo task, cache action, key, path, authority, plan-only run, or acceptance change
---

# TCC-004 deployment-cache candidate

## Current decision

TCC-004 remains an implementation candidate until an authorised hosted Preview
plan-only run proves the exact source, cache behaviour and no-mutation
postcondition. Local workflow and automation contracts establish the intended
boundaries only; they do not prove GitHub, Vercel, Alchemy or Cloudflare state.

## Candidate call graph

~~~text
trusted Preview, Production or reviewed-main teardown
  -> live exact source and candidate admission
  -> exact checkout and Bun setup
  -> restore event-scoped Bun package cache
  -> live frozen install
  -> save package cache only after a miss and successful install
  -> restore event-scoped Playwright Chromium cache
  -> live pinned Chromium install
  -> save browser cache only after a miss and successful install
  -> live non-cacheable workflow-input and accepted-receipt checks
  -> Turbo-backed static deployment-owner check
  -> Turbo-backed provider-free docs build
  -> live Alchemy bootstrap, plan and optional mutation
  -> live provider, hosted and artifact proof

completed deployment workflow
  -> live Actions API and artifact readback
  -> exact reviewed implementation checkout
  -> restore event-scoped Bun package cache
  -> live frozen install
  -> live non-cacheable workflow-input and workflow-run checks
  -> live receipt promotion or bounded failure receipt
~~~

All four workflows use `TURBO_CACHE=local:rw,remote:rw` with the existing
`TURBO_TEAM` variable and `TURBO_TOKEN` secret. GitHub cache restore/save uses
`actions/cache` v6.1.0 pinned to
`55cc8345863c7cc4c66a329aec7e433d2d1c52a9`. Cache steps are non-fatal.

## Cache and live-work matrix

| Work | Treatment | Reason |
| --- | --- | --- |
| Bun package downloads | Event, OS, architecture, Bun version and lockfile keyed GitHub cache | Reusable downloads; frozen install remains live. |
| Playwright Chromium | Event, OS, architecture, resolved Playwright version and lockfile keyed GitHub cache | Reusable browser binaries; pinned install remains live. |
| Static deployment-owner check | Cacheable Turbo root task | Its complete inputs are tracked repository files. |
| Provider-free docs build | Existing cacheable `docs#build` Turbo task with declared `dist/**` output | It can reuse the same content-addressed build as other trusted runs. |
| Workflow input, plan, proof, teardown and completed-run checkers | Turbo tasks with `cache: false` and narrow pass-through environment | They read temporary receipt files or current external identities. |
| GitHub API/artifact reads, Alchemy login/bootstrap/plan/deploy/destroy, provider inventory, hosted proof and receipt promotion | Live commands outside cache replay | They own current authority, external state or postconditions. |

No `node_modules`, Alchemy state, Cloudflare credential, provider response,
hosted response, workflow artifact or promoted receipt enters either cache.
Cache success proves acceleration only.

## Local policy evidence

`bun run test:docs-deployment` passes 57 deployment tests and 432 assertions,
including the new full-SHA action, key, path, order, live-install, no-
`node_modules`, remote-binding and receipt-secret boundary. The automation
register check accepts exactly three deployment automations and five controls,
including `docs-workflow-cache-boundary`. Static deployment validation also
passes with no violations.

## Documentation impact

| Owner | Decision | Reason |
| --- | --- | --- |
| Four workflow files, root scripts, Turbo task map and deployment contracts | Change required | They own exact cache bindings, cacheable work and live external checks. |
| Deployment controls, architecture, runbook and automation register | Change required | They own authority, recovery, proof limits and review triggers. |
| Root and scripts READMEs | Change required | They route contributors to the current command and cache boundaries. |
| Public docs, API, SDK and tax contracts | N/A | No public runtime or package contract changes. |
| Changeset | N/A | Repository workflow and documentation tooling only. |

## Hosted acceptance still required

1. Run the Preview workflow with `operation=plan` for the exact accepted
   candidate and trusted PR identity.
2. Record remote-cache availability, Bun and Chromium cache outcomes, retained
   installs, Turbo build/check outcome and the exact plan digest.
3. Prove the run stopped after plan and uploaded only sanitized plan evidence;
   no deploy, provider readback, hosted proof or receipt promotion may be
   claimed.
4. If any cache path is stale, unsafe or not useful, remove only the cache
   bindings and retain every live deployment boundary.

Production, deploy, rollback and teardown mutations require their own exact
authority and receipts. TCC-004 plan-only evidence does not authorise or prove
them.
