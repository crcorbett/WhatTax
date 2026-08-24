---
document_type: execution-plan
lifecycle: active
authority: supporting
owner: taxkit-implementation-owner
last_reviewed: 2026-08-24
review_trigger: ADS task, workflow contract, Effect boundary, Alchemy fixture, runbook, evidence, candidate, hosted check, merge or closeout change
successor: null
tombstone: false
---

# Alchemy deployment structure corrections execution plan

This plan implements the accepted
[`alchemy-deployment-structure-corrections.md`](../../product-specs/alchemy-deployment-structure-corrections.md)
SPEC and its
[`task ledger`](../../product-specs/alchemy-deployment-structure-corrections.tasks.json)
from accepted commit `0751c49e93c8f78fa774caae6d9e5ccd5b2a8749`.
Cooper accepted all eight finding dispositions and the four ordered tasks on
2026-08-24. The implementation owner may edit, verify, commit, push, open and
merge the repository change after the accepted checks pass. The separately
bounded provider authority permits only the existing TaxKit docs Preview
plan/bootstrap/state and provider readback needed for real beta.64 evidence.

## Outcome and boundaries

The outcome is one verified repository candidate that completes `ADS-001`
through `ADS-004`, reconciles all current owners and accepted findings, passes
fresh local and hosted Quality checks, merges through a pull request, and is
read back at the exact merged commit.

The change preserves one `Cloudflare.Website.Vite("DocsWebsite")` composition
root, Alchemy's Vite build lifecycle, exact-stage decoding, the central
beta.64 plan parser, Preview/teardown locking, Schema-decoded inventory and the
local process-owning workerd proof harness. It adds no `DocsBuild`, second
resource, arbitrary command runner, generic provider wrapper, external lease,
package contract or Changeset.

Production deployment or rollback, DNS or custom-domain change, package
publication, credential creation or rotation, broad Cloudflare cleanup and
unrelated provider mutation remain outside authority.

## Ordered slices

1. **ADS-001 — complete:** Production plan, deploy and rollback now share one
   non-cancellable group; Preview and Production tokens are limited to exact
   provider steps; executable controls and current operator truth agree. The
   bounded proof is
   [`ADS-001-validation.json`](../../documentation-audit/alchemy-deployment-structure/ADS-001-validation.json).
2. **ADS-002 — complete:** one closed typed Effect command owns bootstrap,
   shared identity, native plan projection, provider JSON decoding and
   sanitised receipt/output encoding while YAML keeps environments,
   permissions, authority, provider execution and sequencing. The bounded
   proof is
   [`ADS-002-validation.json`](../../documentation-audit/alchemy-deployment-structure/ADS-002-validation.json).
3. **ADS-003 — complete:** hosted-proof input is decoded once with Effect
   Config and owning Schemas before browser acquisition; safe tagged errors and
   a scoped Playwright adapter close the browser on success, failure and
   interruption. The bounded proof is
   [`ADS-003-validation.json`](../../documentation-audit/alchemy-deployment-structure/ADS-003-validation.json).
4. **ADS-004 — complete:** five provenance-bound real beta.64 plan fixtures
   cover create, update, no-op, delete and empty destroy. The first fresh
   independent review found one fail-open destroy defect and four contract
   gaps; the corrected parser, dependency binding, exact crosswalk, runbook
   inputs and review metadata passed focused proof and a fresh independent
   re-review with no findings. Its bounded proof is
   [`ADS-004-validation.json`](../../documentation-audit/alchemy-deployment-structure/ADS-004-validation.json).

Each slice updates its implementation, focused tests, owning documentation,
task status and bounded validation receipt together. Each slice must pass its
focused checks, the applicable documentation checks, full repository
verification and `git diff --check` before its coherent commit.

## Documentation impact ledger

| Surface | Decision | Owner and proof |
| --- | --- | --- |
| SPEC, task ledger, active plan and indexes | Change required | Keep admission, task status, evidence and lifecycle aligned; parse JSON and run documentation/path checks. |
| Preview and Production workflows and deployment tools | Change required | Workflow YAML owns authority and order; focused contracts prove locking, token placement and command use. |
| Deployment architecture, authority, controls, automation and runbook | Change required | Current owners state bootstrap effects, interruption, lock limits, typed evidence and the one-resource operation. |
| Hosted-proof script and app README | Change required | Config, Schema, tagged errors, scoped browser tests and strict-boundary enforcement prove the local boundary. |
| Versioned beta.64 fixtures and dated validation | Change required | Manifest, digests, capture provenance and parser tests bind local claims to the exact dependency. |
| Native composition, stage decoder, Preview/teardown lock, inventory and workerd harness | Preserve | Focused contracts and final diff review must show no ownership or architecture drift. |
| Existing dated evidence and completed plans | Preserve | They remain byte-stable history; current owners link to them without rewriting them. |
| Public MDX, API, SDK, package exports, releases, DNS, skills and `AGENTS.md` | N/A | No public/package contract or repository-method change is accepted by this SPEC. |

## Proof and stop conditions

Local checks establish source and bounded behaviour only. Hosted GitHub,
provider readback and hosted browser observations need their own exact
candidate receipts. A green plan never authorises apply.

Stop provider work on candidate, principal, stage, resource or state mismatch;
unexpected create, replacement or deletion; uncertain interrupted state; raw
secret exposure; or missing readback. Retain failed, cancelled, deferred,
superseded and no-op evidence with the last successful step, recovery route,
resume trigger, limitations and non-claims.

Closeout requires a fresh independent review, the full checks named by the
task ledger and `AGENTS.md`, hosted Quality on the exact final candidate, merge
readback, relevant post-merge checks, completed validation receipts, all eight
accepted findings reconciled, and movement of this plan to completed history.

## Closeout in progress

All four implementation slices are complete locally. The remaining work is to
run fresh full repository verification on the corrected ADS-004 bytes, commit
and push the coherent slice, open the pull request, obtain hosted Quality on
the exact final candidate, merge, read back the exact merged commit and
relevant post-merge checks, move this plan to completed history and close the
SPEC lifecycle.
