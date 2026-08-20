---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: TCC-004 workflow, Turbo task, cache action, key, path, authority, plan-only run, or acceptance change
---

# TCC-004 deployment-cache evidence

## Current decision

TCC-004 is accepted. Pull request #56 merged the reviewed workflow source as
main commit `58d9572ee3d68de2d1a3d08b16967038a7ea7334`. Authorised Preview
plan-only run `32345183087` then admitted exact candidate
`bae3731748ef90eb7b6d6885115ee6eb76775d8a`, used the trusted cache bindings,
ran the live plan boundary and stopped before deploy. Its exact rerun restored
the newly written Bun and Chromium entries while keeping frozen installation,
the pinned browser installation, Alchemy bootstrap and plan live.

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

## Hosted acceptance

[Preview run 32345183087](https://github.com/crcorbett/taxkit/actions/runs/32345183087)
used workflow commit `58d9572ee3d68de2d1a3d08b16967038a7ea7334`, PR #56 head
`bae3731748ef90eb7b6d6885115ee6eb76775d8a`, stage `pr-56` and
`operation=plan` in both attempts.

| Observation | Attempt 1, cold manual-workflow entries | Attempt 2, warm exact rerun | Bounded result |
| --- | --- | --- | --- |
| Bun packages | The event-scoped key missed. Frozen install stayed live for 14s and the cache saved in 6s. | The exact key restored in 10s, frozen install stayed live for 1s and save skipped. | Setup fell from 20s to 11s for this layer. |
| Chromium | The Playwright `1.61.1`/Linux X64/lockfile key missed. The pinned browser install stayed live for 8s and save took 4s. | The exact key restored in 6s, the pinned install stayed live and completed in under 1s, and save skipped. | Setup fell from 12s to about 6s for this layer. |
| Vercel Remote Cache | The static deployment-owner task replayed hash `06b8ea007792d9a2`; all three provider-free docs build tasks replayed their remote results. | The same four eligible tasks replayed again. Both Turbo commands reported Remote Cache enabled and `FULL TURBO`. | A trusted deployment workflow recorded remote hits while external-input and provider tasks stayed non-cacheable or outside Turbo. |
| Plan boundary | Live Alchemy login/bootstrap and plan produced digest `f76ead54005da979c1a4de49652bb2c7400c99896d6a79c353b7c5909b038b40` and one `DocsWebsite create` projection. | The live plan produced the same digest and projection. | Deterministic plan identity matched; no cached plan supplied authority. |
| Run clocks | 50s worker time and 71s dispatch-to-completion feedback. | 48s worker time and 70s dispatch-to-completion feedback. | Warm dependency setup saved about 15s, but other setup variation left only a 2s worker and 1s feedback difference. No general workflow saving is claimed. |

Each attempt needed one protected-environment approval. GitHub records the
approval boundary but not active reviewer time or the later parent-review
interval, so synchronous maintainer attention and time to accepted outcome are
unknown rather than estimated.

Both attempts skipped `Replan and deploy accepted Preview candidate`, hosted
HTTP/browser proof and provider-readback upload. They uploaded only the
sanitised plan bundle; attempt 2's artefact was `9397867422`. This proves that
the workflow invoked no Website deploy or destroy command. It does not prove
Cloudflare state, public availability, provider readback, receipt promotion,
Production or teardown. The existing Alchemy login/bootstrap step still ran to
materialise its ephemeral state-store credential cache before the live plan.

If any cache path becomes stale, unsafe or not useful, remove only the cache
bindings and retain every live deployment boundary.

Production, deploy, rollback and teardown mutations require their own exact
authority and receipts. TCC-004 plan-only evidence does not authorise or prove
them.
