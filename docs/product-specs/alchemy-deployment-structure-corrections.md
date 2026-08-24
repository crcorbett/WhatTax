---
document_type: product-spec
lifecycle: active
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-24
review_trigger: Alchemy, Cloudflare, docs deployment workflow, hosted proof, concurrency, credential, receipt, or runbook contract change
successor: null
tombstone: false
---

# Alchemy deployment structure corrections

## Status and admission

Cooper accepted this whole SPEC, all four tasks and all eight finding
dispositions on 2026-08-24. The canonical
[active execution plan](../exec-plans/active/alchemy-deployment-structure-corrections.md)
now admits repository implementation, checks, commits, hosted Quality, pull
request delivery and merge after the accepted checks pass.

The accepted provider boundary permits only the existing TaxKit docs Preview
plan/bootstrap/state and provider readback needed for real beta.64 evidence.
Production deploy or rollback, DNS or custom-domain change, package
publication, credential creation or rotation, broad Cloudflare cleanup and
unrelated provider mutation remain outside authority. Every permitted provider
operation still needs the exact principal, operation, resource, environment,
rollback and readback required by the
[authority model](../operations/authority-model.md).

The sibling task ledger is
[`alchemy-deployment-structure-corrections.tasks.json`](./alchemy-deployment-structure-corrections.tasks.json).
The accepted audit register is
[`accepted-findings.json`](../documentation-audit/alchemy-deployment-structure/accepted-findings.json).

## Evidence baseline

The audit and this recheck use the same current default-branch revision:
`42230517ad96ab20a260fad3ce75b29421e59975`. On 2026-08-24,
`origin/main` resolved to that revision, so none of the five confirmed findings
was already fixed.

The dependency baseline below comes from the repository package manifests, the
exact resolutions in `bun.lock` and a successful `bun install
--frozen-lockfile` on 2026-08-24. This proves local resolution only; it does not
prove a hosted runner or provider dependency.

| Boundary | Exact baseline |
| --- | --- |
| TaxKit | `42230517ad96ab20a260fad3ce75b29421e59975` |
| Alchemy | `2.0.0-beta.64`; upstream tag `v2.0.0-beta.64`; commit `31edd3c4b2f0f3310fad07f5423aee20cf72be8d` |
| Effect | `effect`, `@effect/platform-bun`, `@effect/platform-node` and `@effect/vitest` at `4.0.0-beta.100` |
| Cloudflare integration | `@distilled.cloud/cloudflare` `0.30.1`; its Rolldown, runtime and Vite plugin packages at `0.13.8`; direct `@cloudflare/vite-plugin` `1.47.0`; Wrangler `4.114.0` |
| Worker runtime | direct `workerd` `1.20260722.1`; Alchemy's nested runtime resolution `1.20260704.1` |
| TanStack | `@tanstack/react-start` `1.167.65`; `@tanstack/react-router` `1.169.2` |
| Fumadocs | `fumadocs-core` `16.9.3`; `fumadocs-mdx` `14.3.2` |

The Alchemy source and official documentation establish these beta.64 facts:

- `Cloudflare.StateStore.State.bootstrap` can resume a local deployment,
  refresh cached credentials, upload a short-lived edge-preview Worker to read
  the secret, and create or upgrade the state-store Worker.
- the first `deploy`, `plan` or `dev` can therefore prepare or change state-store
  resources before the requested operation continues;
- `Cloudflare.Website.Vite` owns one Vite build and injects the Cloudflare Vite
  plugin; and
- Alchemy's CI guidance uses a non-cancellable deployment concurrency group.

Primary upstream references:

- [Alchemy beta.64 source](https://github.com/alchemy-run/alchemy/tree/v2.0.0-beta.64)
- [State-store behaviour](https://alchemy.run/state-store/)
- [Cloudflare Vite ownership](https://alchemy.run/cloudflare/frontend/vite/)
- [CI concurrency](https://alchemy.run/environments/ci/)

## Problem

The native deployment graph is sound, but five surrounding safety and truth
contracts are not. A Production plan can cancel a Production mutation, secrets
are available to unrelated workflow steps, bootstrap is described too narrowly,
the hosted-proof input boundary is permissive, and the current runbook mixes
retired and current operations.

The audit also identified useful bounded work for duplicated workflow evidence,
real beta.64 parser fixtures and manual CLI lock limits. Leaving those decisions
implicit would make the implementation incomplete.

## Goals

1. Make Production plan, deploy and rollback mutually exclusive and
   non-cancellable within the shared Production stage lock.
2. Make the Cloudflare token available only to named provider steps.
3. Describe and prove bootstrap as mutation-capable state preparation.
4. Decode hosted-proof configuration once through Effect Config and Schema,
   with safe typed failures and scoped browser cleanup.
5. Give operators one current, one-resource `DocsWebsite` procedure.
6. Replace repeated workflow evidence shell with one narrow typed Effect
   command while YAML keeps authority and sequencing.
7. Test the version-bound plan parser with sanitised real beta.64 output.
8. State that GitHub workflow locks do not lock manual CLI mutation.

## Non-goals

- Do not add another Cloudflare resource, another build process or `DocsBuild`.
- Do not replace `Cloudflare.Website.Vite("DocsWebsite")` or move its build
  lifecycle out of Alchemy.
- Do not create a generic infrastructure framework, shell runner, provider
  client wrapper, `helpers`, `common` or `utils` layer.
- Do not add a shared external lease. Manual mutation is not a supported normal
  operating mode.
- Do not change DNS, custom domains, package contracts, publication or release
  policy.
- Do not rewrite historical receipts or completed plans.
- Do not claim that a local check proves GitHub, Cloudflare, hosted or public
  behaviour.

## Accepted audit requirements

| ID | Requirement | Current evidence | Disposition |
| --- | --- | --- | --- |
| ALC-AUD-001 | A Production plan must not cancel an active Production mutation. | `.github/workflows/docs-production.yml` gives plan, deploy and rollback one group but sets `cancel-in-progress` from the plan input. The contract test accepts that expression. | Accepted as `ADS-RQ-001`; implement in `ADS-001`. |
| ALC-AUD-002 | The Cloudflare token must be limited to provider steps. | Preview and Production put `CLOUDFLARE_API_TOKEN` on the job, so install, build, checks and third-party actions inherit it. | Accepted as `ADS-RQ-002`; implement in `ADS-001`. |
| ALC-AUD-003 | Bootstrap claims and receipts must cover its real beta.64 effects. | Current architecture calls bootstrap credential-cache preparation. Matching Alchemy source shows credential refresh, an edge-preview Worker and state-store create or upgrade paths. | Accepted as `ADS-RQ-003`; implement in `ADS-002`. |
| ALC-AUD-004 | Hosted-proof inputs must use the strict Effect boundary. | `apps/docs/scripts/test-cloudflare-hosted.tsx` reads raw environment strings and uses permissive `Number.parseInt`. | Accepted as `ADS-RQ-004`; implement in `ADS-003`. |
| ALC-AUD-005 | The current runbook must describe only the current one-resource operation and current status. | `docs/runbooks/docs-deployment.md` contains current and retired `DocsBuild` plus `DocsWebsite` procedures and stale approval wording. | Accepted as `ADS-RQ-005`; implement in `ADS-004`. |

## Recommendation decisions

| ID | Decision | Reason and boundary |
| --- | --- | --- |
| ALC-AUD-R001 | Accept as `ADS-RQ-006`; implement in `ADS-002`. | Preview and Production repeat identity hashing, provider JSON decoding and receipt encoding. One typed Effect command will own those values. YAML will still own environments, permissions, concurrency, authority checks, provider command order and failure flow. The command will not execute arbitrary shell or provider mutation. |
| ALC-AUD-R002 | Accept as `ADS-RQ-007`; implement in `ADS-004`. | The central fail-closed parser is version-bound, but retained tests do not contain sanitised raw beta.64 plan text for create, update, no-op, delete and empty destroy. Fixtures must be captured from the matching version with provenance, not reconstructed from current documentation. |
| ALC-AUD-R003 | Accept the documentation requirement as `ADS-RQ-008`; implement in `ADS-001`. Defer an external lease. | GitHub concurrency groups cannot block an out-of-band CLI. Normal manual concurrent mutation is unsupported, so an external lease would add a second lock owner without a real supported use case. A future accepted requirement may reopen that choice if manual concurrent mutation becomes necessary. |

No recommendation is silently omitted.

## Stable requirements

- **ADS-RQ-001 — Production lock.** Plan, deploy and rollback use the same exact
  Production group and `cancel-in-progress: false`. A plan waits behind a
  mutation and cannot cancel it.
- **ADS-RQ-002 — Least credential exposure.** Preview and Production have no
  job-wide Cloudflare token. Only the named bootstrap, plan, deploy or rollback,
  provider inventory and other proven provider steps receive it. Checkout,
  dependency install, repository build, validation, evidence upload and
  unrelated third-party actions do not.
- **ADS-RQ-003 — Honest bootstrap.** Bootstrap is an explicit
  mutation-capable control-plane step. Its policy, logs and receipts state the
  allowed beta.64 effects and never describe it as read-only or cache-only.
- **ADS-RQ-004 — Strict hosted-proof ingress.** Environment input is read with
  Effect Config, decoded with owning Schemas and rejected with safe tagged
  errors before Playwright starts. Numeric strings must match the whole input;
  prefixes such as `12x` are invalid.
- **ADS-RQ-005 — One current runbook.** The canonical runbook teaches only the
  one-resource `DocsWebsite` path. It states that automatic PR-close teardown
  now uses the same unreviewed Preview environment and that a fresh
  shared-environment receipt is not an open prerequisite unless that control
  changes. Retired procedures remain immutable dated evidence and are linked as
  history, not copied into the live procedure.
- **ADS-RQ-006 — Typed workflow evidence.** One named Effect command owns shared
  candidate identity, central plan projection use, provider JSON decoding and
  receipt/export encoding. It has a closed set of modes and cannot run arbitrary
  commands. YAML remains the authority and sequencing owner.
- **ADS-RQ-007 — Real parser fixtures.** Sanitised, provenance-recorded
  beta.64 fixtures cover create, update, no-op, delete and empty destroy, plus
  adversarial unknown and malformed lines. The parser stays central,
  version-bound and fail-closed.
- **ADS-RQ-008 — Manual lock limit.** Current operations state that workflow
  locks do not cover manual CLI mutation. Operators must stop manual mutation
  while a matching workflow is queued or running. Break-glass work requires a
  separately authorised sole-writer window and provider/state readback.

## Architecture to preserve

These are constraints, not redesign targets:

- `alchemy.run.ts` remains the single composition root with one
  `Cloudflare.Website.Vite("DocsWebsite")` resource.
- There is no separate `DocsBuild` process.
- Alchemy owns the Vite build lifecycle.
- deployment stages are exactly Schema-decoded;
- plan text is projected by the central beta.64-bound fail-closed parser;
- Preview and teardown keep their shared exact-stage non-cancellable lock;
- provider inventory remains Schema-decoded and must agree with state; and
- the local `workerd` child process remains only inside its process-owning proof
  harness, with scoped shutdown.

## Current call graph

```text
GitHub workflow YAML
  -> job-wide Cloudflare token
  -> checkout / install / build / validation
  -> Alchemy bootstrap (documented as cache-only)
  -> Alchemy plan or mutation
  -> repeated shell hashing and jq decoding/receipt encoding
  -> hosted proof script
       -> raw process.env
       -> permissive parseInt
       -> Playwright

Production plan, deploy and rollback
  -> one concurrency group
  -> plan sets cancellation on
  -> a plan can interrupt an active mutation
```

## Target call graph

```text
GitHub workflow YAML
  -> environment, permissions, exact-stage lock and operation order
  -> explicit bootstrap step [Cloudflare token only here]
  -> Alchemy plan/deploy/rollback [token only on provider steps]
  -> provider inventory [token only here]
  -> typed workflow evidence command
       -> Effect Config / owning Schemas
       -> candidate identity calculation
       -> central beta.64 plan projection
       -> provider JSON decoding
       -> receipt and GitHub-output encoding
  -> hosted proof boundary
       -> Effect Config + exact Schemas
       -> scoped Playwright host adapter

Production plan, deploy and rollback
  -> one exact non-cancellable group
  -> interruption becomes an uncertain operation requiring readback
```

## Semantic owners

| Meaning | Earliest durable owner |
| --- | --- |
| Native resource and build composition | `alchemy.run.ts`, `apps/docs/vite.config.ts` — preserve |
| Stage identity | `apps/docs/src/lib/build/docs-deployment-stage.ts` — preserve |
| Plan projection | `tools/docs-deployment/workflow-plan-projection.ts` — preserve and fixture-test |
| Workflow authority and sequence | `.github/workflows/docs-preview.yml`, `.github/workflows/docs-production.yml`, `.github/workflows/docs-preview-teardown.yml` |
| Shared workflow values and evidence encoding | `tools/docs-deployment/workflow-evidence.schemas.ts`, `workflow-evidence.ts` and `workflow-evidence.runtime.ts`; no generic provider framework |
| Provider inventory | existing `tools/docs-deployment` inventory Schemas and services — reuse |
| Hosted proof input and browser lifetime | `apps/docs/scripts/cloudflare-hosted-proof.boundary.ts` and `test-cloudflare-hosted.tsx` |
| Architecture and authority truth | `docs/architecture/deployment.md`, `docs/operations/authority-model.md` |
| Live operator procedure | `docs/runbooks/docs-deployment.md` |
| Automation and control claims | `docs/operations/automation-register.md`, `docs/standards/controls.md` |
| Accepted finding traceability | `docs/documentation-audit/alchemy-deployment-structure/accepted-findings.json` |

## Repository harness applicability

| Invariant | Application |
| --- | --- |
| `HC-OUTCOME-001` | The product owner accepts the whole SPEC; the later active plan will integrate all four slices and their closeout. |
| `HC-CTX-001`, `HC-CTX-002`, `HC-DOC-001` | Code owns runtime meaning, architecture owns design, the runbook owns the repeatable procedure, the task ledger owns pending work, receipts own observations, and dated evidence owns history. The live runbook links to history instead of copying it. |
| `HC-REPO-001`, `HC-FEEDBACK-001` | Repeated workflow evidence becomes typed code and tests at the earliest owner; retired shell and retired live procedure text are removed from the current route. |
| `HC-BOUNDARY-001` | Workflow JSON, environment input, provider output and receipt output decode or encode once through owning Schemas. |
| `HC-TOOL-001` | The typed command has named discovery inputs, closed invocation modes, typed interpretation, safe recovery hints and real provider readback routes. |
| `HC-PROOF-001`, `HC-EVIDENCE-001` | Local, workflow, provider and hosted claims have separate receipts. Failed, interrupted, deferred and no-op results remain identifiable with non-claims. |
| `HC-AUTH-001` | Tool access, a token, GitHub approval and observed Cloudflare state remain separate facts. |
| `HC-AUTO-001` | Existing workflows keep an observable candidate/stage signal, exact lock state, bounded authority, fail-closed stop, receipt and recovery path. This SPEC admits no new background automation. |
| `HC-DEPENDENCY-001` | Alchemy behaviour and fixtures bind to beta.64 and its exact upstream commit; an upgrade must replace the binding and compatibility proof together. |
| `HC-LIFETIME-001` | Every new command, fixture and control has an owner, review trigger and retirement condition below. |
| `HC-EPOCH-001`, `HC-METRIC-001` | N/A: this SPEC makes no claim about agent, worker or harness effectiveness and uses no activity count as proof. |

## Effect Config, Schema and error contracts

### Workflow evidence command

The command has a closed Schema-decoded mode union. It may calculate source,
configuration and build digests; project a plan through the existing parser;
decode bounded provider JSON through existing inventory Schemas; and encode
GitHub output plus sanitised receipt JSON. It may read only named input files
and write only named evidence/output files supplied by the workflow.

It must not invoke Alchemy, Wrangler, GitHub or arbitrary shell. The workflow
creates raw provider output files, calls the command, then uses its decoded
output. One `BunRuntime.runMain` entry point owns application execution.

Config keys, paths, stages, operations, digests, resource identities, plan
version and receipt versions have owning Schemas. Unknown JSON fields do not
become trusted values. Existing inventory and stage Schemas are reused rather
than mirrored.

Expected failures are tagged by safe meaning, for example configuration,
input-read, plan-projection, provider-decode and receipt-write errors. Error
fields may name the operation, key or safe file role. They must not carry token
values, raw provider payloads, secret-bearing URLs or unsanitised plan text.

### Hosted proof

The hosted proof reads URL, expected stage, digests, output paths and numeric
limits through Effect Config. Schemas validate complete strings, safe URL and
path forms, exact stage identity, digest shape and bounded positive numbers.
Missing, empty, malformed, prefix-numeric and unsafe-path inputs fail before a
browser starts.

The Playwright Promise API is a focused host adapter wrapped immediately with
`Effect.tryPromise`. Browser acquisition and close use Scope and
`acquireRelease`, so failure or interruption still closes the browser. Errors
are tagged and secret-safe. Tests cover malformed input and cleanup on failure
and interruption.

## Authority and credential boundary

Workflow YAML continues to own the GitHub environment, permissions, concurrency
key, operation choice, approved candidate and sequence. Typed code owns data
meaning and encoding; it does not grant authority.

The token exposure rule is a negative contract: a workflow test must prove that
no job-level Cloudflare token exists and that only an allowlist of provider
steps receives it. A later provider run must record the named principal,
workflow/run identity, candidate revision, exact stage, operation, resources,
time bound, result, revocation or expiry, recovery path and provider readback.

Bootstrap is not a harmless prelude. It is an authorised provider step with the
possible beta.64 effects `credential-refresh`, `edge-preview-secret-read` and
`state-store-create-or-upgrade`. Its receipt records which effects were allowed,
which safe state-store facts were observed before and after, and what could not
be observed. It never records credentials or a secret-bearing temporary URL.

Completion of bootstrap permits the following plan step to inspect the desired
state. It does not prove that bootstrap was read-only, and a plan receipt does
not authorise apply.

## Concurrency and interruption

Production plan, deploy and rollback share one exact stage group with
`cancel-in-progress: false`. Preview and teardown keep their existing shared
exact `pr-N` group with cancellation off. Different Preview stages remain
independent.

Cancellation or runner loss during bootstrap or mutation leaves the provider
result unknown. Retry is forbidden until state and provider inventory are read
back and a recovery receipt classifies the result. Interruption is not converted
to success. Scoped local command and browser resources still close.

GitHub groups cannot lock a manual CLI. Manual mutation is unsupported while a
matching workflow is queued or running. Break-glass recovery needs a named
sole-writer window, exact-stage preflight, retained result and post-operation
state/provider readback. No shared external lease is planned.

## Proof and receipt contract

| Claim | Minimum proof | Explicit non-claim |
| --- | --- | --- |
| Source policy is correct | workflow contract tests, Effect unit tests, fixture tests, documentation checks and repository verification on an exact source revision | Does not prove a hosted workflow or provider state. |
| Secret exposure is narrowed | static workflow parse proving no job token and an exact step allowlist | Does not prove historical runner memory or provider revocation. |
| Bootstrap completed | authorised workflow receipt plus safe state-store/provider readback | Does not prove no provider mutation occurred. |
| Plan is admitted | exact candidate and stage identities, beta.64 fixture-backed projection, provider/state agreement and sanitised plan receipt | Does not authorise apply or prove hosted behaviour. |
| Mutation completed | provider readback bound to the workflow, candidate, stage and resource identities | Does not prove HTTP or browser behaviour. |
| Hosted docs work | existing `taxkit-docs-preview` or `taxkit-docs-production` journey receipt with HTTP, browser, console and cache checks | Does not prove publication, DNS ownership or another stage. |
| Rollback worked | last-known-good identity, provider version readback and hosted postcondition | A source revert alone is not rollback proof. |

The existing four docs-deployment journey IDs remain unchanged. No new critical
journey is created because this work strengthens their admission and evidence
boundaries rather than adding user behaviour.

## Fixture contract

Sanitised fixtures live under a clearly versioned
`tools/docs-deployment/fixtures/alchemy-beta.64/` owner. Their manifest records
the Alchemy package version, upstream commit, capture route, scenario, redaction
rules and digest. Fixtures contain no account ID, Worker URL, credential,
machine-local path or provider secret.

The required scenarios are create, update, no-op, delete and empty destroy.
Tests also reject unknown actions, unrecognised resources, replacement-like
output, malformed lines and version drift. Empty destroy must be recognised as
an evidenced no-change destroy result, not a parser failure or an invented
delete.

If real capture cannot be produced without provider authority, implementation
stops and requests that authority. Handwritten examples are not a substitute.

## Rollout and rollback

Implementation is split into four small vertical slices in the sibling ledger.
Each slice changes its code or workflow, focused tests, semantic documentation
and evidence together. Each passes focused checks and full verification before
its future commit.

The first hosted run, if separately authorised, is a plan-only Preview candidate
that proves the bootstrap receipt, token boundary and typed evidence command.
Production deploy or rollback is not required to accept the local design and is
not authorised by this SPEC.

Source rollback reverts only the accepted slice. Workflow rollback restores the
last accepted workflow and command together. A provider operation that was
interrupted or partly applied cannot be rolled back by assumption: first retain
the failure, read back state and provider inventory, then use the documented
normal recovery path under fresh authority.

## Documentation impact

| Surface | Decision | Required owner or reason |
| --- | --- | --- |
| SPEC, task ledger, finding register and product-spec index | Change required | These four artefacts admit and trace the proposed work. The active-plan index is preserved until acceptance. |
| Deployment workflows and contract tests | Change required during implementation | Own concurrency, credential scope and sequencing. |
| Deployment architecture, authority, automation and controls | Change required during implementation | Must state bootstrap effects, lock limits, token scope and typed evidence ownership. |
| Canonical deployment runbook | Change required during implementation | Must contain one current `DocsWebsite` procedure and current status. |
| `tools/docs-deployment` code, tests, fixtures and README | Change required during implementation | Own the typed evidence command and beta.64 parser proof. |
| Hosted-proof script, `cloudflare-hosted-proof.boundary.ts`, focused tests and `apps/docs/README.md` | Change required during implementation | Own strict Config/Schema ingress and scoped browser lifetime. |
| Native resource root, exact-stage decoder and local workerd harness | Preserve | Current architecture is correct and is an explicit regression boundary. |
| Historical evidence and completed plans | Preserve | They remain immutable provenance and do not teach the live operation. |
| Public MDX content, API, SDK, package exports and package versions | N/A | No public product or package contract changes. No Changeset is required unless implementation later changes such a contract. |
| Release, publication, DNS and custom domains | N/A | Outside scope and not authorised. |
| Skills, `AGENTS.md` and repository harness controls | N/A | Existing rules already cover this work. |
| Root and package READMEs, formatter, TypeScript config, manifests and package scripts | Preserve | The app and deployment-tool READMEs change, but no root/package contract, formatter, TypeScript or manifest change is needed. Existing directory-wide test and type commands admit the new files. |

## Security and secret-negative observability

- Tests assert where the Cloudflare token is absent as well as where it is
  allowed.
- Logs and receipts may contain safe stage, workflow, source, configuration,
  build, resource and provider-version identities.
- They must not contain token values, credential cache contents, temporary
  edge-preview URLs with secrets, raw secret-store payloads, local absolute
  paths or unsanitised provider JSON.
- Error rendering is Schema-controlled and uses safe summaries. Unknown input
  fails closed and is not echoed whole.
- Evidence uploads receive sanitised encoded files, not raw environment dumps.

## Maintenance ownership

The docs deployment owner maintains workflow and receipt contracts. The docs app
owner maintains hosted proof. The documentation owner maintains architecture,
authority, automation and runbook truth. The product owner accepts or rejects
this SPEC and later lifecycle changes.

Review is triggered by any Alchemy version change, state-store bootstrap change,
Cloudflare credential or inventory change, workflow concurrency change,
plan-output change, hosted-proof input change or manual-mutation policy change.
The beta.64 fixtures and parser binding must be replaced together when Alchemy is
upgraded.

The intended carrying cost is one small typed command, one focused hosted-proof
boundary, five versioned plan fixtures and their contract tests. A second
service, provider framework or external lease would exceed that budget. Remove
the beta.64 fixture set when the dependency is upgraded and its accepted
successor fixtures pass; remove the manual-lock warning only if a shared lock
with provider readback becomes the accepted owner.

The external-lease deferral is reopened only if an accepted requirement makes
concurrent manual mutation a supported operation. Evidence that manual mutation
is frequent does not by itself justify a lease; the owner, failure model and
recovery contract must also be accepted.

## Acceptance criteria

This SPEC is review-ready when:

1. all five findings and all three recommendations map to stable requirements
   and executable tasks;
2. current and target call graphs name the authority and Effect boundaries;
3. the preserved native architecture is an explicit regression contract;
4. configuration, Schema, error, interruption, credential, proof, receipt,
   rollout and rollback rules are testable;
5. the documentation impact ledger records Change required, Preserve or N/A for
   each material surface;
6. the sibling JSON artefacts parse and cross-reference exactly;
7. draft documentation, runbook, repository-path and repository verification
   checks pass or an exact environment limitation is recorded; and
8. no active execution plan or external mutation is created.

## Explicit non-claims

- This document does not prove that implementation exists.
- It does not prove that GitHub workflow cancellation or secret scope has
  changed.
- It does not prove any Cloudflare state, deployment, rollback or hosted result.
- It does not authorise access to credentials or providers.
- It does not prove package publication, DNS or public availability.
- It does not turn historical `DocsBuild` observations into current resources.
