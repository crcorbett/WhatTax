---
document_type: product-spec
lifecycle: implemented
authority: supporting
owner: taxkit-product-owner
last_reviewed: 2026-08-21
review_trigger: Alchemy resource graph, DocsBuild retirement, Vite memo, deployment workflow, state migration, receipt Schema, lock, rollback, or deployment documentation change
successor: null
tombstone: false
---

# Native Alchemy docs hard cutover

## Overview

Make the native Alchemy `Cloudflare.Website.Vite("DocsWebsite")` graph the
only current TaxKit docs deployment model. Remove the remaining executable and
policy surfaces for the former `DocsBuild` plus `DocsWebsite` graph, correct
the deployment lock and build-input gaps found in the Alchemy audit, and leave
only immutable historical evidence for the old graph.

This is a hard repository cutover. It is not a new deployment architecture and
the SPEC itself does not authorise Preview, Production, teardown, credential,
Cloudflare or Alchemy mutation. The separately authorised Preview state
reconciliation is recorded as evidence below.

## Problem

The root Alchemy composition is already native, but current workflow parsers,
Schemas, policy functions and tests still admit `DocsBuild` and the old
two-resource state shape. The workflows also use different GitHub concurrency
groups for Preview and PR-close teardown. Finally, Alchemy's Vite memo is not
explicitly configured for the sibling documentation packages that are bundled
by the docs app.

The result is a split boundary: the desired code graph is native, while parts
of current deployment policy still describe a migration. That permits legacy
resource identities, leaves a stale-build risk, and does not guarantee that a
teardown waits for a Preview mutation on the same stage.

## Source authority

The implementation target is the current TaxKit checkout with:

- Alchemy `2.0.0-beta.64`, tag `v2.0.0-beta.64`, revision
  `31edd3c4b2f0f3310fad07f5423aee20cf72be8d`;
- Effect `4.0.0-beta.100`;
- `@distilled.cloud/cloudflare` `0.30.1`;
- `@distilled.cloud/cloudflare-vite-plugin` `0.13.8`.

The Alchemy source authority is the pinned beta.64 tag. Current upstream
documentation remains a compatibility reference only until a separately
approved upgrade SPEC is admitted. Relevant primary references are the
[Alchemy Vite documentation](https://alchemy.run/cloudflare/frontend/vite/),
[state store documentation](https://alchemy.run/state-store/),
[resource lifecycle documentation](https://alchemy.run/infrastructure-as-code/resource-lifecycle/),
[beta.64 Vite source](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.64/packages/alchemy/src/Cloudflare/Workers/Vite.ts),
and [beta.64 worker provider source](https://github.com/alchemy-run/alchemy/blob/v2.0.0-beta.64/packages/alchemy/src/Cloudflare/Workers/WorkerProvider.ts).

No machine-local reference checkout path belongs in this SPEC, receipts or
other durable TaxKit files.

## Pre-cutover call graph (audit baseline)

```ts
Production: pre-cutover

GitHub Preview / Production / teardown workflow
  -> alchemy plan or destroy
    -> shell parser and duplicated legacy-aware projection
      -> workflow receipt Schema and provider/state inventory

alchemy.run.ts
  -> Alchemy.Stack("TaxKitDocsCloudflare")
    -> Cloudflare.providers()
    -> Cloudflare.state()
    -> Cloudflare.Website.Vite("DocsWebsite")
      -> apps/docs/vite.config.ts
        -> Fumadocs MDX source generation
        -> TanStack Start and React
        -> Alchemy-injected Cloudflare Vite plugin
      -> one Cloudflare Worker and Assets resource
```

```ts
Tests: pre-cutover

workflow contract and deployment policy tests
  -> current Schemas and policy functions
    -> accepted one-resource graph plus legacy DocsBuild branches
      -> JSON receipt and historical fixture assertions
```

## Current call graph after hard cutover

```ts
Production: current

GitHub Preview / Production / teardown workflow
  -> one shared stage concurrency group
    -> alchemy plan or destroy
      -> one typed, fail-closed plan projection
        -> current one-resource Schema: DocsWebsite / Cloudflare.Worker
          -> read-only state/provider agreement inventory
            -> hosted proof and sanitised receipt

alchemy.run.ts
  -> Alchemy.Stack("TaxKitDocsCloudflare")
    -> Cloudflare.providers()
    -> Cloudflare.state()
    -> Cloudflare.Website.Vite("DocsWebsite")
      -> explicit beta.64-supported Vite memo for docs-content and docs-fumadocs
      -> apps/docs/vite.config.ts
        -> one shared Fumadocs generation phase
        -> TanStack Start and React
        -> Alchemy-owned Cloudflare Vite plugin
      -> one Cloudflare Worker and Assets resource
```

```ts
Tests: current

focused deployment tests
  -> current Schemas and policy functions
    -> only DocsWebsite / Cloudflare.Worker
      -> cutover, lock, memo and receipt assertions

historical evidence checks
  -> immutable archived JSON only
    -> provenance and non-claims
      -> no current deployment admission
```

## Goals

### HAC-001 — one current Alchemy resource

Keep [alchemy.run.ts](../../alchemy.run.ts) as the only current composition
owner. The current graph must contain exactly one docs resource:
`Cloudflare.Website.Vite("DocsWebsite")`.

No current source, workflow, policy, Schema, receipt admission rule, test
fixture or README may create, update, accept, or expect `DocsBuild`,
`Command.Build`, a prebuilt docs workspace artifact, or a separate manually
coordinated docs Worker.

### HAC-002 — bounded legacy state cutover

The implementation must establish whether any admitted Alchemy stage still
contains the old `DocsBuild` resource before mutation. If it does, the only
permitted legacy action is a one-time `DocsBuild` deletion while the native
`DocsWebsite` resource is retained and independently identity-checked.

The cutover must fail closed for:

- `DocsBuild` create, update or noop;
- a missing or mismatched `DocsWebsite` Worker;
- any resource outside the native allow-list;
- state/provider disagreement;
- an unknown stage, candidate, account or plan identity.

After successful state/provider absence readback, remove the deletion branch,
legacy resource literals, migration Schemas, migration policy fixtures and
workflow compatibility expressions. The post-cutover current graph must have
no `DocsBuild` or `Command.Build` surface.

Historical receipts and dated audit records are not rewritten or deleted. They
remain evidence of their recorded old graph and must be excluded from current
deployment admission and current architecture claims.

### HAC-003 — explicit Vite build inputs

Configure the installed beta.64-supported Alchemy Vite memo/workspace input so
changes under `packages/docs-content` and `packages/docs-fumadocs`, together
with the lockfile, change the Alchemy build input. Confirm the exact option
shape against installed beta.64 types before editing.

The Fumadocs `configPath` and generated-source `outDir` must be resolved from
the app's Vite configuration location, not from the caller's working
directory. Alchemy invokes the native Vite build from the repository root,
while the standalone package build runs from `apps/docs`; both paths must
therefore target the same `packages/docs-content/.source` directory and
regenerate its collection maps after a cached package build.

The receipt deployment-input digest may remain as evidence, but it must not be
treated as a substitute for Alchemy's own resource memo.

### HAC-004 — one Preview stage lock

Preview deploy and PR-close teardown must use the identical concurrency group
for the same `pr-N` stage. Mutation jobs must remain non-cancellable. The
workflow contract test must assert the exact group expression, not only the
shared GitHub environment.

### HAC-005 — one current plan boundary

Replace duplicated workflow parsing with one repository-owned, fail-closed
plan projection contract. It must accept only the current native resource
shape and must reject unknown resource lines. If no supported structured
Alchemy plan interface exists in beta.64, the text adapter must be version
bound, fixture-tested and kept as a host boundary rather than presented as an
Alchemy domain model.

### HAC-006 — preserve native ownership and strict boundaries

Preserve the Alchemy-injected Vite guard in
[apps/docs/vite.config.ts](../../apps/docs/vite.config.ts), the Effect-owned
read-only inventory boundary, Schema decoding, redacted credential handling,
exact-stage identity checks and the existing local/CI/provider/hosted proof
separation. No raw provider value, credential, unchecked SDK value or new
generic child-process wrapper may cross an owning boundary.

## Non-goals

- No Alchemy, Cloudflare, GitHub environment, credential, DNS or hosted state
  mutation as part of SPEC authoring.
- No Alchemy version upgrade. Beta.72 or later requires a separate compatibility
  SPEC and source ledger.
- No rewrite or deletion of immutable historical deployment evidence.
- No public MDX, navigation, content, design or route behaviour change.
- No package export, publication, Changeset or npm operation.
- No replacement of the native Alchemy lifecycle with a custom build/deploy
  system.
- No claim that local checks prove Preview, Production, provider state or
  public availability.

## Ownership and boundaries

| Boundary | Owner | Required result |
| --- | --- | --- |
| Native resource graph | `alchemy.run.ts`, `apps/docs/src/lib/build/` | One `Website.Vite` resource and typed stage/config values. |
| Docs Vite build | `apps/docs/vite.config.ts`, `apps/docs/README.md` | Alchemy owns the Cloudflare plugin in native mode; sibling inputs are memoised. |
| Plan and receipt admission | `tools/docs-deployment/` | Current one-resource schemas and one shared projection; no legacy admission after cutover. |
| Workflow mutation | `.github/workflows/docs-preview.yml`, `docs-preview-teardown.yml`, `docs-production.yml` | Exact candidate/stage checks, identical Preview lock, fail-closed native allow-list. |
| Provider/state readback | `tools/docs-deployment/inventory.*` | Read-only state/provider agreement and absence proof. |
| Durable architecture and operations | `docs/architecture/deployment.md`, `docs/runbooks/docs-deployment.md`, `docs/operations/` | Current native graph and actual lock; historical evidence clearly separated. |
| Historical evidence | `docs/evidence/deployments/`, dated audits and completed plans | Preserve provenance; no current admission or timeless availability claim. |

## Accepted audit findings and decisions

| Finding | Decision in this SPEC |
| --- | --- |
| `TAX-ALCH-001` Preview/teardown lock mismatch | Accepted. HAC-004. |
| `TAX-ALCH-002` sibling Vite memo gap | Accepted. HAC-003. |
| `TAX-ALCH-003` duplicated human-plan parsing | Accepted. HAC-005. |
| Existing native Website.Vite graph and injected-plugin guard | Preserve. HAC-001 and HAC-006. |
| Historical two-resource receipts | Preserve as evidence only; remove current compatibility admission. HAC-002. |

## Implementation slices

1. Establish a clean source/state inventory and exact beta.64 memo option before
   changing the resource graph or workflows.
2. Implement the one-time legacy deletion and native-only current policy. Do
   not allow a legacy create/update/noop path.
3. Add the sibling workspace memo and prove a sibling source change changes the
   Alchemy build input without applying infrastructure.
4. Unify Preview and teardown concurrency groups and add an exact expression
   contract test.
5. Consolidate the plan projection and remove all current `DocsBuild`/
   `Command.Build` literals, schemas, policy branches, tests and README claims.
6. Update architecture, runbook, standards/automation pointers and the active
   plan. Preserve historical evidence and record the cutover receipt.
7. Run the full local verification sequence, then obtain separately authorised
   exact-stage provider and hosted proof. A later implementation change reopens
   closeout.

## Verification and proof

### Implementation status

All six repository slices are implemented and locally verified. HAC-002 is
complete after a separately authorised Preview state reconciliation. The
sanitised terminal receipt is
[`legacy-state-cutover.json`](../evidence/deployments/2026-08-21-native-alchemy-hard-cutover/legacy-state-cutover.json).

The first separately authorised Preview attempt, run `32436973454`, stopped
before `alchemy deploy` when inventory found the legacy `DocsBuild` resource in
exact stage `pr-16`. It did not create or delete application resources. The
later read-only inventory in run `32438980355` found five exact legacy stages —
`pr-15`, `pr-16`, `pr-17`, `pr-18` and `pr-23` — and stopped before
`alchemy deploy` because the temporary migration preflight was still limited to
one globally discovered stage. It did not create or delete application
resources.

The approved one-stage reconciliation then processed those five stages in
order. The first `pr-15` apply, run `32440967336`, passed the equal replan and
Alchemy reported `DocsBuild` deleted and `DocsWebsite` updated, but stopped in
post-mutation inventory because the temporary legacy-readback allowance was
not applied there. It remains incomplete evidence, not a same-run success.
The corrected `pr-16` run `32441466447` confirmed the resulting `pr-15`
native-only state before reducing the count from four to three. Runs
`32441635009`, `32441777832` and `32441944207` then reduced the global legacy
stage count from three to zero for `pr-17`, `pr-18` and `pr-23`. The final
readback retained `DocsWebsite` for every recorded stage and reported
state/provider agreement.

This is a bounded observation of the separately authorised Preview operation.
It does not claim a Production deployment or Production cutover. The final
inventory included `prod` as a read-only native-only observation only.

### Local

The cleanup candidate passed the focused docs-deployment tests and type checks,
documentation and runbook checks, repository path check, lint, formatting,
`git diff --check` and `bun run verification`. Full verification exited 0 and
reported zero violations for both deployment and deployment-automation
validation. These local checks do not establish provider state, hosted
behaviour or public availability.

The direct local oracles are:

- current source/workflow/policy search finds no active `DocsBuild` or
  `Command.Build` admission after the cutover branch is removed;
- the native plan fixture contains exactly `DocsWebsite`;
- changing each sibling docs package changes the Alchemy memo/input result;
- a repository-root Alchemy Vite invocation regenerates the shared Fumadocs
  source and includes authored page modules after a cached sibling-package
  build;
- Preview and teardown group expressions are byte-for-byte equal;
- historical evidence remains readable only through explicitly historical
  paths and cannot satisfy current plan admission.

### Provider and hosted

Only a separately authorised workflow may prove the cutover externally. It
must record the exact candidate commit, Alchemy version, stage, account,
pre-mutation state/provider inventory, native plan, one-time legacy deletion if
present, equal replan, deployment or teardown result, post-mutation inventory,
Worker identity and hosted result.

Provider readback proves provider/state observations for that operation. Hosted
HTTP/browser proof proves only the observed URL and candidate-bound behaviour.
Neither proves package publication, permanent availability or unrelated
Cloudflare resources.

## Authority, rollback and failure handling

The SPEC authorises repository implementation planning only. It does not
authorise provider mutation. Implementation must stop before mutation if the
principal, candidate, account, stage, credentials, plan, resource identity,
state/provider agreement or rollback identity is unknown.

The one-time legacy deletion must be reversible only through the native
Alchemy source graph and a separately reviewed source-bound redeploy; it must
not recreate `DocsBuild`. An uncertain provider write requires readback before
retry. A failed or partial cutover retains its receipt as failed/inconclusive
evidence and does not promote the current automation register.

## Documentation impact ledger

| Surface | Decision | Evidence and required postcondition |
| --- | --- | --- |
| This SPEC and sibling task list | Change required | Own current hard-cutover intent and requirement-to-proof mapping. |
| Active execution plan and product-spec index | Change required | Record the implemented closeout and receipt; no completed SPEC is reopened. |
| `alchemy.run.ts`, docs Vite config and app README | Change required | Document one native resource and explicit memo ownership. |
| Deployment workflows and deployment tooling | Change required | Remove current legacy admission, unify locks and use one native projection. |
| Deployment architecture, runbook, standards and automation register | Change required | State the actual native graph, lock and cutover/rollback procedure. |
| Current policy tests, Schemas and fixtures | Change required | Reject legacy resource identities after cutover. |
| Historical evidence and completed plans | Preserve | Do not rewrite; label as historical and exclude from current policy. |
| Public MDX, navigation, design and route content | N/A | The requested change does not alter authored public behaviour. |
| Package exports, Changesets, publication and release | N/A | No package API or release-train contract changes. |
| Repository skills and `AGENTS.md` | N/A unless implementation changes the operating loop | Existing routing is sufficient; revisit only if a new command or authority boundary is introduced. |

## Acceptance criteria

- [x] The current Alchemy composition contains only
  `Cloudflare.Website.Vite("DocsWebsite")` for the docs application.
- [x] A controlled, exact-stage cutover deletes `DocsBuild` only if it is
  actually present, never creates or updates it, and proves its absence after
  the operation.
- [x] After cutover, active source, workflow, policy, Schema, fixture and
  README searches contain no `DocsBuild` or `Command.Build` deployment surface.
- [x] Historical receipts remain immutable and are explicitly excluded from
  current deployment admission.
- [x] The beta.64-supported Alchemy memo includes both sibling docs packages
  and the lockfile, with a focused invalidation proof.
- [x] Preview deploy and PR-close teardown use the same non-cancellable stage
  concurrency group, and a contract test asserts that exact equality.
- [x] One fail-closed plan projection replaces duplicated legacy-aware shell
  projections, or a separately evidenced reason records why a supported
  structured Alchemy interface is unavailable in beta.64.
- [x] Architecture, runbook, automation/policy owners, active plan and index
  agree with the final graph and lock.
- [x] Focused checks, documentation/runbook checks, repository path checks,
  full verification and `git diff --check` pass on the exact candidate.
- [x] Provider and hosted claims, if performed, are separately receipt-bound
  and do not exceed their actual authority or observation boundary.
- [x] No Changeset is created because this is repository deployment policy and
  app/IaC configuration, not a published package contract.

## References

- [Native Alchemy docs integration](./native-alchemy-docs-integration.md)
- [Native Alchemy docs deployment](./native-alchemy-docs-deployment.md)
- [Deployment architecture](../architecture/deployment.md)
- [Docs deployment runbook](../runbooks/docs-deployment.md)
- [Docs deployment tooling](../../tools/docs-deployment/README.md)
- [Alchemy Vite documentation](https://alchemy.run/cloudflare/frontend/vite/)
- [Alchemy state store documentation](https://alchemy.run/state-store/)
