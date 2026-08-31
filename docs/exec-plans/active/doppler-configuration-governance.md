---
document_type: execution-plan
lifecycle: current
authority: canonical
owner: taxkit-platform-owner
last_reviewed: 2026-08-31
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

Approved repository work:

- read-only repository, sibling and official-guidance research;
- SPEC, task-ledger, plan, source, test, workflow, docs and runbook changes;
- local deterministic checks;
- coherent commits, pull-request creation and merge after required checks pass.

Separately approved and completed on 31 August 2026:

- exact `taxkit` project/config creation and masked value transfer;
- three account-owned, TaxKit-only Cloudflare credentials for development,
  Preview and Production with the recorded account, permission groups and
  expiry;
- three read-only expiring Doppler automation tokens and the exact repository,
  Preview and Production GitHub bridges; and
- one repository-scoped personal Doppler login plus value-free metadata and
  non-deploying credential checks.

Still not approved without a separate exact operation:

- creating, changing, rotating, revoking or deleting a GitHub or Cloudflare
  credential beyond the completed bootstrap envelope;
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
| DCG-003 | Accepted | Preview and teardown use only `taxkit/stg_preview`; Preview fetches `taxkit/ci` separately, teardown stays local-only, and all three upload classes use the secret-negative allowlist boundary. |
| DCG-004 | Accepted | Protected Production and rollback use only `taxkit/prd`, fetch `taxkit/ci` separately after cache saves, and upload only prepared secret-negative plan/provider evidence. |
| DCG-005 | In progress; deployment authority pending | PR #73 is open. The exact TaxKit Doppler configs, Cloudflare credentials, service tokens, GitHub bridges and local scoped login are created and read back without values. Quality run `33351826840`, attempt 2, passed trusted `taxkit/ci` fetch, identity and the full remote-cache Quality graph at exact head `7a12205…`. Preview/Production deployment proof and legacy removal remain separately bounded. |

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
  three automation configs. Local `dev` uses only the named developer's scoped
  personal login and receives no service token. Exact-claim OIDC is a future
  reviewed successor, not a second live path.
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

### DCG-003 — accepted 28 August 2026

- Preview fetches `taxkit/ci` and `taxkit/stg_preview` through two separately
  pinned v2.0.0 action steps after all Bun and Chromium cache saves. Safe
  metadata checks require exact project `taxkit` and configs `ci` or
  `stg_preview` before any consumer runs.
- Only the provider-free deployment check and docs build receive the two Turbo
  outputs. Only bootstrap, plan and equal-replan/apply receive the two
  Cloudflare outputs. No direct legacy binding or broad action injection
  remains in Preview source.
- Exact-stage teardown uses only the Preview environment's `stg_preview`
  provider bridge. It has no `ci` fetch, remote Turbo cache or Production
  config path. The existing exact `pr-N` lock, two-plan comparison, destroy and
  provider/state absence proof are unchanged.
- One typed Effect artifact owner decodes a fixed mode and copies only its
  named sanitised JSON and screenshot files into a separate upload directory.
  Raw Alchemy output, stderr, intermediate inventories and raw hosted
  diagnostics stay runner-local. Secret sentinels, token shapes, missing
  required files, unsafe paths and a widened allowlist fail with value-free
  errors.
- Documentation impact: **Change required** and completed for root/docs app
  guidance, configuration/deployment architecture, automation register,
  deployment/recovery runbooks, tool owner, SPEC ledger and active plan.
  **Preserve** is recorded for the native Alchemy resource, state, stage, lock,
  plan, provider/hosted readback and teardown contracts. A Changeset is **N/A**
  because no installed package or public export changed.
- Pinned Bun `1.3.14` focused proof passed 41 contract/boundary/automation
  tests. Full deployment proof passed 92 tests and 706 assertions. The final
  full `bun run verification` passed repository paths, documentation,
  runbooks, deployment/automation checks, lint, formatting, skills, Quality,
  Knip, production Knip and all workspace type checks.
- No Doppler config/token, GitHub secret/variable or Cloudflare/Alchemy
  resource was created, changed, read by value, rotated or removed. The new
  hosted Preview/teardown source remains unproved until DCG-005 bootstrap and
  exact-SHA hosted proof are separately authorised.

### DCG-004 — accepted 28 August 2026

- Production now fetches the minimum `taxkit/ci` and `taxkit/prd` configs
  through separate v2.0.0 action steps after all cache saves. It checks exact
  project/config metadata before any named output reaches a consumer.
- Turbo outputs reach only the accepted Preview plan check, accepted Preview
  provider/hosted check, deployment-owner validation and provider-free docs
  build. Cloudflare outputs reach only bootstrap, fixed Production plan and
  equal-replan/deploy-or-rollback. No direct legacy binding or broad injection
  remains in Production source.
- The reviewer-protected `taxkit-docs-production` environment, fixed `prod`
  non-cancellable lock, accepted Preview chain, initial/equal plan checks,
  provider readback, hosted proof and normal source-bound rollback/redeploy are
  unchanged. Static tests reject `stg_preview`, the Preview environment and any
  direct Cloudflare/Turbo source in Production.
- Production plan and provider uploads use the same typed allowlist owner as
  Preview. Raw plan/replan output, provider inventories and raw hosted
  diagnostics stay runner-local; the provider artifact retains only its final
  readback, hosted proof, workflow input and approved screenshots.
- Recovery now names bridge disablement, one reviewed repository revert,
  Production reviewer/lock readback, replacement-before-revocation rotation
  and the separate approval needed to remove retained legacy custody. No mixed
  fallback is admitted.
- Documentation impact: **Change required** and completed for root/docs app
  guidance, configuration/deployment architecture, the authority model,
  automation register, deployment/recovery runbooks, SPEC ledger and active
  plan. **Preserve** is recorded for native Alchemy, protected Production and
  rollback meaning. A Changeset is **N/A** because no installed package or
  public export changed.
- Pinned Bun `1.3.14` focused proof passed 42 contract/boundary/automation
  tests. Full deployment proof passed 93 tests and 733 assertions. The final
  full `bun run verification` passed repository paths, documentation,
  runbooks, deployment/automation checks, lint, formatting, skills, Quality,
  Knip, production Knip and all workspace type checks.
- No Doppler config/token, GitHub secret/variable or Cloudflare/Alchemy
  resource was created, changed, read by value, rotated or removed. The new
  Production/rollback source remains unproved until DCG-005 bootstrap and
  exact-SHA hosted proof are separately authorised.

### DCG-005 — authority-stop clarification on 28 August 2026

- A fresh read-only check found no TaxKit Doppler project, no repository
  `DOPPLER_CI_TOKEN`, and no Preview or Production
  `DOPPLER_PROVIDER_TOKEN`. The retained direct Turbo and Cloudflare entries
  remain present by name only.
- Doppler CLI 3.76.5 confirms that config service-token creation accepts both
  `--access read` and `--max-age`, while GitHub CLI 2.83.1 accepts secret values
  through standard input and encrypts them locally. The approved operation can
  therefore transfer each new bridge directly without a file, environment
  variable, clipboard or printed value.
- The SPEC's earlier phrase “one service token per config” contradicted its
  local personal-login design. It now requires exactly three automation tokens
  for `ci`, `stg_preview` and `prd`; `dev` has no service token or GitHub bridge.
- GitHub cannot return the retained direct secret values. Bootstrap therefore
  remains stopped until the operation record names an approved separate secure
  source for those values or separately authorises replacement credentials.
- Documentation impact: **Change required** for the credential lifecycle in
  the SPEC/task ledger, this plan and the deployment runbook. Architecture,
  workflow code, package/app READMEs, repository skills and installed package
  behaviour are **Preserve**. A Changeset remains **N/A**.

### DCG-005 — approved credential bootstrap on 31 August 2026

- Cooper approved the exact replacement envelope: three TaxKit-only,
  account-owned Cloudflare tokens for development, Preview and Production,
  fixed to account `f9f94270a4a5af8af7010d891020922d`, the three measured
  Workers Scripts Write, Workers Observability Write and Secrets Store Write
  groups, expiry on 18 November 2026, direct one-time Doppler transfer and
  Cooper as revocation owner. DNS, deployment, old-token removal and legacy
  GitHub-secret removal were excluded.
- Doppler project `taxkit` now has exactly four locked root configs: `dev`,
  `ci`, `stg_preview` and `prd`. The required names are present as masked
  strings. Development and the two provider configs contain only the matching
  Cloudflare account/token pair; `ci` contains only the Turbo team/token pair.
- Three separate read-only service tokens expire on 18 November 2026 and are
  bound one-to-one to `ci`, `stg_preview` and `prd`. They were transferred
  directly into repository `DOPPLER_CI_TOKEN` and the Preview/Production
  environment `DOPPLER_PROVIDER_TOKEN` bridges. Development has no service
  token.
- Three separate active Cloudflare tokens have the approved account scope,
  permissions and expiry. A first unused development token was revoked after
  its direct-transfer process lost standard input; readback found no active
  remainder for that identifier. All three replacement tokens passed
  Wrangler `4.114.0` account checks through only their matching Doppler config.
  No deploy command ran.
- The existing approved Turbo value moved directly from its secure source to
  `taxkit/ci`. No secret passed through a checkout file, shell argument,
  clipboard, log, cache or receipt.
- A repository-scoped personal CLI login named `TaxKit checkout 2026-08-31`
  is held by a mode-`0600` Doppler config through a system-keyring reference.
  The pass/fail custody check passed. A first browser paste used unrelated
  stale clipboard text, was rejected, and was replaced by a fresh hidden
  short-lived code; no partial login remained.
- One invalid `79d` service-token duration was rejected before Doppler created
  a token. GitHub briefly received an empty CI bridge, which was immediately
  overwritten by the valid `1896h` read-only token. Names-only readback shows
  one active CI token and the corrected bridge timestamp.
- The immutable, secret-negative operation record is
  [`DCG-005-doppler-bootstrap-2026-08-31`](../../evidence/deployments/2026-08-31-doppler-bootstrap/receipt.json).
  It retains exact non-secret token identities, scope, expiry, failures,
  rollback and non-claims, but no value, hash, preview, private account name,
  email or local machine path.
- Documentation impact: **Change required** and completed for the SPEC/task
  review date, product/active-plan indexes, this plan and the deployment
  evidence index/receipt. Canonical architecture, runbooks, workflow source,
  package/app READMEs and the native Alchemy graph are **Preserve** because the
  performed operation matched their reviewed contract. Public docs,
  packages/exports, generated output, skills and a Changeset are **N/A**.

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

DCG-003 deterministic proof establishes exact Preview/teardown config
selection, cache-before-fetch order, named-output placement, Production
isolation and secret-negative prepared uploads. It preserves the earlier
hosted receipts as immutable history but does not claim that the new Doppler
source ran on GitHub or accessed Cloudflare.

DCG-004 deterministic proof establishes protected `prd` selection, separate
`ci` consumers, fixed-stage and rollback preservation, Preview isolation and
secret-negative Production artifacts. It does not claim that the new Doppler
source ran on GitHub, reached Production or completed a rollback.

DCG-005 repository delivery started with pull request
[`#73`](https://github.com/crcorbett/taxkit/pull/73). Hosted Quality run
[`33090706119`](https://github.com/crcorbett/taxkit/actions/runs/33090706119)
was bound to exact head `86e7f6a54667033432356babef77600d84e4604d` and completed
checkout, frozen install, dependency/browser cache handling and the Quality
workflow policy. It then failed at the pinned `Fetch trusted CI configuration`
step; the metadata check and release graph did not run. This is names-only
hosted failure proof of the missing repository bridge, not proof of a Doppler
config, secret value, cache result, deployment or provider state. No action log
or credential value was read into the record.

The implementation head observed during the bootstrap precondition readback,
`46a51adbf150f62fbe2abf289194fd62abeb60a9`, produced the same bounded failure
in hosted Quality run
[`33091612475`](https://github.com/crcorbett/taxkit/actions/runs/33091612475):
steps through the repository-owned Quality policy passed, and the first Doppler
fetch failed before any metadata check or release command. Read-only
reconciliation on 31 August 2026 found no TaxKit Doppler project, repository
`DOPPLER_CI_TOKEN` or Preview/Production `DOPPLER_PROVIDER_TOKEN` bridge. The
retained direct GitHub values remain present by name. The retained account-owned
Cloudflare mutation token remains active until 3 September 2026 with the exact
three permission groups recorded in the earlier capability receipt, but its
bearer value has no approved recoverable source. The approved bootstrap stopped
before mutation because its precondition requires all values to have a secure
source. Separate authority for three TaxKit-only account-owned replacement
tokens is the smallest resume action. The sanitized dated receipt is
[`DCG-005-bootstrap-precondition-2026-08-31`](../../evidence/deployments/2026-08-31-doppler-bootstrap-precondition/receipt.json).
The follow-up evidence commit `29a2a651b2d8f67d9c7c4a90f200d9cf6a9c108d`
then produced the same bounded result in hosted Quality run
[`33351760442`](https://github.com/crcorbett/taxkit/actions/runs/33351760442):
workflow policy passed and the missing bridge stopped the trusted fetch. The
pull request remained open and unmerged at that observation.

Documentation impact for this read-only reconciliation is **Change required**
for the dated evidence receipt/index and this active plan. The reviewed SPEC,
task ledger, architecture, authority model, deployment/recovery runbooks,
workflow source and implementation remain **Preserve** because the required
design and stop rule did not change. Package/app READMEs, public documentation,
generated references, skills and a Changeset are **N/A** because this slice
changes no command, package, export, runtime or public behaviour. Pinned Bun
`1.3.14` full verification and a forced 93-test deployment run passed; these
checks prove the repository state only and do not prove external bootstrap.

The approved bootstrap then established the exact TaxKit stores and bridges at
implementation head `7a12205bf635c8243cf600461f2130924b5c1c7a`.
`bun run check:doppler-custody` passed for the repository-only personal login.
A local `taxkit/ci` run of the Quality policy used Turbo remote caching and
passed. Wrangler `4.114.0` account checks passed through each of `dev`,
`stg_preview` and `prd` without deployment. Trusted Quality run
[`33351826840`](https://github.com/crcorbett/taxkit/actions/runs/33351826840),
attempt 2, then passed the pinned Doppler fetch and exact `taxkit/ci` metadata
check at that head. Its trusted remote-cache Quality step and whole job
completed successfully. The fork-only step was correctly skipped for this
same-repository pull request, so hosted fork behaviour is not claimed. Preview,
Production, rollback, merged-main and legacy-removal proof remain separate
boundaries.

## Versioning

This work changes repository workflows, internal tools and maintainer docs. It
does not change an installed package, public export or package behaviour, so no
Changeset is expected. Each slice must recheck that conclusion.

## Recovery

Before any separately approved deployment, repository-source recovery remains
a normal reviewed revert. The completed credential bootstrap is recovered by
the exact bridge and token procedures below rather than by deleting provider
state blindly.

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
