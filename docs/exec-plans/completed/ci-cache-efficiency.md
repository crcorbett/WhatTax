---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-execution-history-owner
last_reviewed: 2026-08-20
review_trigger: TCC task, workflow, cache authority, hosted run, verification, or lifecycle change
successor: ../../product-specs/ci-cache-efficiency.md
tombstone: false
---

# Turbo and CI Cache Efficiency Execution Plan

Spec: [Turbo and CI Cache Efficiency](../../product-specs/ci-cache-efficiency.md)

Task list:
[`ci-cache-efficiency.tasks.json`](../../product-specs/ci-cache-efficiency.tasks.json)

## Outcome

TCC-001 through TCC-005 route eligible deterministic repository and workspace
commands through Turbo, use Vercel Remote Cache under an event-safe authority
envelope, and retain separate GitHub-hosted caches for Bun packages and
Playwright Chromium. Cache misses and cache outages leave the full uncached
command graph runnable. The terminal decision is `retain` with bounded
performance claims.

## Authority and stop boundary

Cooper's 2026-08-20 approval authorises the complete active SPEC under the
bounded cache envelope. The selected Vercel team, dedicated empty cache
project, expiring team-scoped token, GitHub `TURBO_TOKEN` secret and
`TURBO_TEAM` variable now exist. The replacement token and matching
`taxkit-turbo-ci-team-2026-08-20` item read back from the Corbett Family
`taxkit` 1Password vault without exposing the bearer. Pull-request run
`32323001841`, attempt 2, proved Remote Cache connectivity in read-only mode,
and the superseded project-scoped token is revoked. PR #55 merged the accepted
TCC-002 source to `main`; a trusted write followed by same-commit main and
pull-request read hits. PR #56 merged the remaining source as main commit
`58d9572`; exact main Quality run `32344762628` passed. Authorised Preview
plan-only run `32345183087` and its exact rerun proved trusted remote hits, cold
then warm dependency entries, a stable plan digest and a skipped deploy path.
Deployment, publication, release, package publication, DNS and unrelated
provider mutation remain outside this cache authority.

## Task status

| Task | Status | Bounded result |
| --- | --- | --- |
| TCC-001 | Complete | Cold and hosted baselines, Turbo inputs, cache keys, event matrix, cache authority and names-only provider/secret/vault readback are accepted. |
| TCC-002 | Complete | The Quality graph uses audited Turbo tasks; trusted main wrote and reused the cache, while a pull request reused the same hash under read-only authority. The same-commit hosted main run fell from 5m36s to 1m09s. |
| TCC-003 | Complete | Exact hosted keys reused Bun packages and Chromium while frozen install, system dependencies and the nine-check browser graph stayed live; setup steps improved, but the two-run sample did not reduce total job time. |
| TCC-004 | Complete | All four trusted workflows use the bounded cache layers; Preview plan-only run `32345183087` retained live admission and plan work, replayed only eligible tasks and skipped deploy/readback/hosted proof. |
| TCC-005 | Complete | The final review retains all three layers, records bounded cold/warm evidence and limitations, and closes the lifecycle with no Changeset. |

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

## Terminal evidence

- [TCC-002 Quality Turbo evidence](../../documentation-audit/ci-cache-efficiency/TCC-002-quality-turbo-candidate.md)
- [TCC-003 dependency-cache evidence](../../documentation-audit/ci-cache-efficiency/TCC-003-dependency-cache-candidate.md)
- [TCC-004 deployment-cache evidence](../../documentation-audit/ci-cache-efficiency/TCC-004-deployment-cache-candidate.md)
- [TCC-005 closeout](../../documentation-audit/ci-cache-efficiency/TCC-005-closeout.md)

No Changeset is required because the completed work changes CI configuration,
repository tooling and maintainer documentation only. It does not change a
published package, export, API, SDK or runtime contract.

## Documentation impact ledger

| Owner | Decision | Evidence |
| --- | --- | --- |
| SPEC, task list, product index and execution-plan indexes | Change required | The terminal outcome and completed lifecycle are now recorded. |
| Completed execution plan and dated evidence | Change required | The retained measurements, limitations, non-claims and retirement triggers close TCC-005. |
| Operational authority model | Change required | The cache authority, selected team, empty project, expiring token metadata, GitHub secret/variable names and 1Password item are established without recording the bearer. |
| `turbo.json`, package scripts and workflows | Preserve for TCC-001 | This task audits them; executable changes begin in TCC-002. |
| Root and scripts READMEs, testing architecture, CI controls, automation register and release-readiness runbook | Change required for TCC-002 | They now own the Turbo-backed leaf graph, event-scoped remote access, fallback and proof limits. |
| Quality workflow/policy, CI controls, automation register, testing architecture, authority model, root/scripts READMEs and TCC-003 evidence | Change required for TCC-003 | They own separate event-scoped Bun-package and Chromium-binary caches, live install order, fallback and hosted proof limits. |
| Four docs deployment/receipt workflows, Turbo task map, deployment contracts/controls, deployment architecture/runbook, automation register, root/scripts READMEs and TCC-004 evidence | Change required for TCC-004 | They own trusted remote access, event-scoped dependency caches, cacheable provider-free build work, explicitly live external checks and plan-only proof. |
| Public docs, API, SDK and package READMEs | N/A | Qualification changes no public or package contract. |
| Harness profile and critical journeys | N/A | Cache evidence does not create a consumer-visible journey or general effectiveness claim. |
| Changeset | N/A | Planning and CI qualification do not change a published package. |

## Recovery and non-claims

Recovery removes only the affected cache bindings or restore/save steps while
preserving frozen installation, browser installation and the complete uncached
release and deployment-proof graphs. Cache evidence cannot prove deployment,
publication, registry state, public availability or a correct provider
mutation.
