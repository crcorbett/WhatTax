---
document_type: execution-plan
lifecycle: current
authority: canonical
owner: taxkit-platform-owner
last_reviewed: 2026-08-28
review_trigger: task acceptance, implementation discovery, authority change, hosted proof, rollback, or closeout
successor: null
tombstone: false
---

# Doppler configuration governance execution plan

SPEC:
[Doppler configuration governance](../../product-specs/doppler-configuration-governance.md)

Task ledger:
[`doppler-configuration-governance.tasks.json`](../../product-specs/doppler-configuration-governance.tasks.json)

## Objective

Make Doppler the governed source for TaxKit's operator-set credentials and
related environment identities while preserving credential-free development,
fork verification, native Alchemy deployment and evidence that contains no
secret material.

The primary agent owns the repository diff, review, checks, recovery decisions,
commits and final proof. Research delegation supplied independent read-only
evidence only; its conclusions are not accepted without repository review.

## Authority

Approved now:

- read-only repository, sibling and official-guidance research;
- SPEC, task-ledger, plan, source, test, workflow, docs and runbook changes;
- local deterministic checks;
- coherent commits, pull-request creation and merge after required checks pass.

Not approved without a separate exact operation:

- creating or changing a Doppler project, config, identity, service token or
  secret;
- creating, changing, rotating, revoking or deleting a GitHub or Cloudflare
  credential;
- provider deployment or mutation beyond the separately authorised existing
  deployment runbook operation;
- legacy credential removal; or
- DNS, domain, publication or unrelated deployment changes.

## Starting identity

| Item | Identity |
| --- | --- |
| Checkout | TaxKit repository root |
| Branch | `codex/adopt-doppler-for-taxkit-configuration` |
| Starting HEAD | `d2f7a3b4b90c54d4e930b438c42a29f1a89c60df` |
| Starting `origin/main` | `d2f7a3b4b90c54d4e930b438c42a29f1a89c60df` |
| Working tree | Clean at research start |

## Status

| Task | Status | Current evidence or stop |
| --- | --- | --- |
| Research | Complete | TaxKit, Bundjil, Site, Pollsor and current official Doppler/Bun/GitHub/Alchemy/Cloudflare guidance inspected read-only; exact revisions are in the SPEC. |
| PRD draft | Complete | First SPEC/task-ledger draft written under the PRD writer route and then revised in place. |
| PRD review | Complete | Ready with bounded external stop; findings and corrections are recorded below. |
| DCG-001 | Accepted | Fixed `taxkit/dev` adapter, keyring-only custody check, separate `dev_<user>` stack stage, tests and current docs accepted without provider access. |
| DCG-002 | Accepted | Trusted Quality and successful receipt validation use pinned `taxkit/ci` named outputs after cache saves; forks and failed/cancelled receipt paths fetch no credential. |
| DCG-003 | Pending | Depends on DCG-002 acceptance. |
| DCG-004 | Pending | Depends on DCG-003 acceptance. |
| DCG-005 | Pending authority | No TaxKit Doppler project, repository `DOPPLER_CI_TOKEN` or protected-environment `DOPPLER_PROVIDER_TOKEN` bridge existed at the research baseline. |

## Research record

### Current TaxKit findings

- No Doppler config, wrapper or workflow use exists.
- Ordinary root development uses Portless and needs no governed credential.
- Local Cloudflare docs development calls `alchemy dev` directly.
- Quality reads Turbo inputs directly from repository secret/variable scope.
- Preview, teardown and Production read Cloudflare values directly from their
  GitHub environments.
- The existing Alchemy graph has one native docs app, one Website.Vite
  resource, explicit `pr-<number>`/`prod` stages, locks, equal replan,
  provider readback, hosted proof and recovery controls that must be preserved.
- Deployment workflows can upload broad runner temporary directories containing
  raw plan, replan, destroy or error files. The new credential path must close
  that evidence risk rather than carry it forward.
- Cache save currently happens before provider credentials are used. That
  useful order must remain true before Doppler fetch.
- The repository pins Bun `1.3.14`, while the research host initially exposed
  Bun `1.4.0`; final proof must use the repository pin.

### External-state readback

- `doppler projects --json` returned no TaxKit project.
- Current GitHub repository and protected environments contain direct Turbo,
  Cloudflare and retired report-only Alchemy state credentials but no Doppler
  bridge token.
- No secret value was read, printed, copied or changed.

### Design decisions

- Use explicit root wrapper project/config flags rather than commit a
  `.doppler.yaml`; one source owns selection.
- Disable Doppler fallback and Bun automatic `.env` loading.
- Use the immutable Doppler secrets-fetch action and named outputs only; do not
  install the moving Doppler CLI action in CI.
- Use separate read-only, expiring, single-config service tokens for the
  reviewed implementation. Exact-claim OIDC is a future reviewed successor,
  not a second live path.
- Keep `ci` limited to Turbo. Preview and Production use separate protected
  provider bridges, so teardown cannot fetch unused Turbo values.
- Strip ambient Doppler and governed provider values before local fetch, and
  disable Doppler env config, Doppler fallback, Bun `.env` and Alchemy `.env`.
- Admit Alchemy's `dev_<user>` default through a separate local stack-stage
  Schema without widening the `pr-N | prod` deployment/evidence Schema.
- Keep `dev`, `ci`, `stg_preview` and `prd`; do not invent a fixed staging
  deployment TaxKit does not have.
- Keep host, GitHub, Alchemy-internal and evidence-derived values outside
  Doppler.
- Prepare an allowlisted artifact directory and leave raw provider output
  runner-local.
- Retain legacy GitHub values for rollback until merged-main proof; do not keep
  a silent mixed-source fallback in workflow source.

## PRD review record

Outcome on 28 August 2026: **Ready with bounded external stop**.

The edit-first review accounted for the 480 baseline Markdown/JSON documents
under `docs/` and 18 relevant READMEs through `docs/README.md`, then re-read the
current configuration, deployment, Effect, testing, authority, automation,
runbook, SPEC/task and execution-plan owners. Historical evidence was treated
as immutable provenance, not current policy.

Findings corrected in the SPEC and task ledger:

1. The first draft combined Turbo and Cloudflare values in protected configs.
   It now keeps `ci` Turbo-only and uses separate Preview/Production provider
   bridges, so teardown cannot fetch unused Turbo credentials.
2. The current local `alchemy dev` defaults to `dev_<user>`, while TaxKit's
   deployment Schema accepts only `pr-N | prod`. DCG-001 now owns a separate
   local stack-stage Schema and explicitly preserves the narrower workflow and
   evidence stage.
3. Bun's `--no-env-file` does not disable Alchemy beta.64's own `.env` loader.
   The internal command now requires an intentionally empty committed env-file
   input.
4. Explicit Doppler project/config flags do not stop an ambient
   `DOPPLER_TOKEN` from entering the child. The fixed local adapter now strips
   ambient Doppler/provider values and uses `--no-read-env`.
5. Doppler CLI 3.76.5 can fall back from the system keyring to a mode-`0600`
   raw token in its config, and `doppler configure debug` can print it. The
   onboarding contract now requires a pass/fail-only custody checker and
   forbids that debug command.
6. The secrets-fetch action fetches its whole config. Configs now contain only
   the minimum named values, required values must use masked visibility, and
   safe project/config metadata is checked before consumers run.
7. Receipt reconciliation currently re-uploads its downloaded source artifact
   and raw GitHub API response. DCG-002 now prepares a bounded final receipt or
   failure directory before upload; DCG-003/004 close the broader provider
   artifact paths.
8. The first draft left service-token and OIDC paths both open. The reviewed
   implementation now chooses read-only expiring service tokens. OIDC is a
   separately reviewed successor.

The path-evidenced impact ledger has a concrete task for every
`Change required` row and evidence for every `N/A` or `Preserve` row. The task
sequence proves a small local path first, then Quality, Preview and Production.
The provider bootstrap, credential changes, hosted proof, legacy removal and
final merge remain bounded by DCG-005 and the authority model.

## Implementation log

### DCG-001 — accepted 28 August 2026

- `bun run docs:dev:cloudflare` now checks for a repository-scoped, system
  keyring-backed Doppler login and then runs one fixed `taxkit/dev` command.
- The adapter removes ambient Doppler and Cloudflare values, disables Doppler
  environment reads and fallback, admits only the two named Cloudflare values,
  and disables Bun and Alchemy `.env` loading.
- The internal Alchemy command remains source-neutral. The existing native
  Alchemy app and Website.Vite resource graph is unchanged.
- The stack now accepts Alchemy's local `dev_<user>` name through a separate
  Schema. Deployment and evidence inputs still accept only `pr-N` or `prod`.
- The custody check reports only pass or a safe reason. It rejects raw tokens,
  a missing repository scope and config readable by group or other users. The
  runbook forbids `doppler configure debug` because Doppler 3.76.5 can print a
  raw token there.
- Ordinary `bun run dev` and Portless remain credential-free.
- Documentation impact: **Change required** and completed for the root and docs
  app READMEs, configuration and deployment architecture, docs deployment tool
  README and deployment runbook. **Preserve** is proved for the native Alchemy
  resource and deployment/evidence stages. A Changeset is **N/A** because no
  installed package behaviour or export changed.
- Strict Effect review found one decoded YAML boundary, safe tagged errors, no
  unsafe cast, no broad catch, no raw secret error and exact runtime owners.
  Repository-structure review found no new package or general helper layer.
- No provider, Doppler or GitHub resource or credential was created, changed,
  read by value, rotated or removed.

### DCG-002 — accepted 28 August 2026

- Trusted same-repository Quality and `main` runs fetch the minimum `taxkit/ci`
  config with Doppler's v2.0.0 action pinned to
  `451892f16195f9ac360e1a5bcbf0b5fd0e957534`. Only that action reads
  repository `DOPPLER_CI_TOKEN`.
- A separate value-free step checks project `taxkit` and config `ci`. Only the
  trusted canonical release step receives named Turbo outputs. Fork pull
  requests do not run the action and execute the same release graph with local
  cache only.
- All Bun and Chromium cache saves precede the fetch. The Quality policy rejects
  broad injection, direct legacy bindings, wrong metadata/outputs, a moved
  fetch, widened fork access and extra credential-bearing steps.
- Successful receipt reconciliation follows the same fetch/check rule after
  its Bun cache save. Failed or cancelled source runs do not fetch Doppler.
  Turbo outputs exist only on the exact two-check validation step.
- Receipt upload now uses a new allowlisted folder containing exactly one final
  reconciled or failure JSON file. Downloaded deployment artifacts and raw
  GitHub API responses stay in the runner work folder and are not re-uploaded.
- The touched setup-bun comments now match the pinned v2.2.0 commit. Preview,
  Production and teardown provider credential paths are deliberately preserved
  for DCG-003/004.
- Documentation impact: **Change required** and completed for root Quality
  guidance, configuration and testing architecture, the automation register,
  deployment runbook and machine-readable control registers. **Preserve** is
  recorded for provider workflow authority and the native Alchemy graph. A
  Changeset remains **N/A** because no installed package changes.
- Focused proof passed 18 Quality policy tests, 17 workflow contract tests and
  8 deployment automation tests, plus exact policy checks, types, lint,
  formatting, docs and runbooks. The full repository result is recorded on the
  final DCG-002 tree before commit.
- No Doppler config/token, GitHub secret/variable or provider resource was
  created, changed, read by value, rotated or removed. Hosted trusted Quality
  and receipt fetch remain unproved until DCG-005 bootstrap authority.

## Verification log

The reviewed document set passed JSON parsing and `git diff --check`.
Documentation checks initially could not start because dependencies were
absent; `bunx --bun bun@1.3.14 install --frozen-lockfile` installed the exact
lockfile graph.

DCG-001 focused proof passed with pinned Bun `1.3.14`:

- 31 focused custody, adapter, strict-boundary and stage tests passed; the full
  docs deployment suite passed 84 tests and 639 assertions;
- type checks for Alchemy and its deployment tools, lint, formatting, Knip,
  production Knip, docs, runbooks and repository-path checks passed;
- `bun run check:doppler-custody` and `bun run docs:dev:cloudflare` both stopped
  before Doppler or provider work with only
  `FAIL [doppler-custody] reason=scoped-token`, as expected because this checkout
  has no repository-scoped login; and
- the full `bun run verification` result is recorded on the final DCG-001 tree
  before its commit.

This proves the local command and its failure path. It does not prove a live
TaxKit Doppler config, secret fetch, Cloudflare access or deployment.

DCG-002 deterministic proof establishes the trusted/fork workflow shapes,
cache-before-fetch order, exact named-output scope and one-file receipt upload.
It does not prove the action fetched a live TaxKit config or that GitHub ran the
new workflow.

## Versioning

This work changes repository workflows, internal tools and maintainer docs. It
does not change an installed package, public export or package behaviour, so no
Changeset is expected. Each slice must recheck that conclusion.

## Recovery

Before external bootstrap, recovery is a normal repository revert.

During approved migration overlap, legacy GitHub values are retained but not
referenced by new source. If the new bridge fails, the operator disables it and
reverts to the last reviewed direct-source workflow commit, then reads back the
exact GitHub environment and workflow identity. Mixing both sources in one
workflow is forbidden.

After replacement proof, legacy removal needs separate approval and metadata
readback. Alchemy state recovery remains owned by the existing deployment and
recovery runbooks.

## Closeout requirements

- All locally authorised tasks are accepted and committed coherently.
- Full repository checks pass using pinned Bun `1.3.14`.
- Any missing provider authority is named by exact principal, resource,
  environment, change, rollback and readback.
- Hosted and provider proof is bound to exact SHA and environment, or is left
  as an explicit non-claim.
- The SPEC/task ledger and plan move to implemented/completed only when their
  recorded status matches reality.
- The final pull request is merged only when required checks and authority
  prerequisites pass, followed by exact local HEAD/origin/main/GitHub identity
  reconciliation.
