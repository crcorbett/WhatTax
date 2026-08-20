---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: TCC task, workflow, cache authority, hosted run, verification, or lifecycle change
successor: null
tombstone: false
---

# Turbo and CI Cache Efficiency Execution Plan

Spec: [Turbo and CI Cache Efficiency](../../product-specs/ci-cache-efficiency.md)

Task list:
[`ci-cache-efficiency.tasks.json`](../../product-specs/ci-cache-efficiency.tasks.json)

## Outcome

Route every eligible deterministic repository and workspace command through
Turbo, use Vercel Remote Cache under an event-safe authority envelope, and add
separate GitHub-hosted caches for Bun packages and Playwright Chromium. Cache
misses and cache outages must leave the full uncached command graph runnable.

## Authority and stop boundary

Cooper's 2026-08-20 approval authorises the complete active SPEC under the
bounded cache envelope. The selected Vercel team, dedicated empty cache
project, expiring team-scoped token, GitHub `TURBO_TOKEN` secret and
`TURBO_TEAM` variable now exist. The replacement token and matching
`taxkit-turbo-ci-team-2026-08-20` item read back from the Corbett Family
`taxkit` 1Password vault without exposing the bearer. Pull-request run
`32323001841`, attempt 2, proved Remote Cache connectivity in read-only mode,
and the superseded project-scoped token is revoked. TCC-001 admits TCC-002
workflow mutation. Deployment, publication, merge, release, package
publication, DNS and unrelated provider mutation remain outside this cache
authority.

## Task status

| Task | Status | Bounded result |
| --- | --- | --- |
| TCC-001 | Complete | Cold and hosted baselines, Turbo inputs, cache keys, event matrix, cache authority and names-only provider/secret/vault readback are accepted. |
| TCC-002 | In progress | The Quality graph uses audited Turbo tasks; pull-request read-only Remote Cache connectivity passed, while trusted-main write/hit proof still needs separately authorised merge. |
| TCC-003 | Pending | Add separate Bun and Chromium caches after TCC-002. |
| TCC-004 | Pending | Change trusted deployment and receipt workflows after the Quality slices. |
| TCC-005 | Pending | Measure hosted cold/warm outcomes and close the lifecycle. |

## TCC-001 working set

- Dated evidence:
  [`TCC-001-qualification.md`](../../documentation-audit/ci-cache-efficiency/TCC-001-qualification.md)
- Read-only authority:
  [`TCC-001-read-only-authority.json`](../../documentation-audit/ci-cache-efficiency/TCC-001-read-only-authority.json)
- Executable owners: `turbo.json`, root and workspace `package.json` files,
  the five GitHub Actions workflows, Quality policy, deployment policy and the
  release-readiness graph.
- Mandatory local proof: Bun cache location, forced Turbo build and type
  checks, Quality policy, documentation, runbook and diff checks.
- Accepted resume trigger: Cooper approved the complete SPEC implementation in
  the `cooper-corbetts-projects` Hobby team on 2026-08-20. TCC-001 must retain
  project, token metadata, GitHub secret/variable names, expiry, revocation and
  removal readback before TCC-002.

## Documentation impact ledger

| Owner | Decision | Evidence |
| --- | --- | --- |
| SPEC, task list, product index and active-plan index | Change required | Implementation has begun and TCC-001 owns the current bounded work. |
| Active execution plan and dated qualification evidence | Change required | TCC-001 needs current status, measurements, non-claims and a resume trigger. |
| Operational authority model | Change required | The cache authority, selected team, empty project, expiring token metadata, GitHub secret/variable names and 1Password item are established without recording the bearer. |
| `turbo.json`, package scripts and workflows | Preserve for TCC-001 | This task audits them; executable changes begin in TCC-002. |
| Root and scripts READMEs, testing architecture, CI controls, automation register and release-readiness runbook | Change required for TCC-002 | They now own the Turbo-backed leaf graph, event-scoped remote access, fallback and proof limits. |
| Public docs, API, SDK and package READMEs | N/A | Qualification changes no public or package contract. |
| Harness profile and critical journeys | N/A | Cache evidence does not create a consumer-visible journey or general effectiveness claim. |
| Changeset | N/A | Planning and CI qualification do not change a published package. |

## Recovery and non-claims

Before workflow mutation, recovery is deletion or correction of this bounded
planning/evidence slice. Later cache slices must recover by removing cache
bindings while preserving the complete uncached graph. Cache evidence cannot
prove deployment, publication, registry state, public availability or a
correct provider mutation.
