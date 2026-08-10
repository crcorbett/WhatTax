---
document_type: authority-model
lifecycle: current
authority: canonical
owner: taxkit-authority-model-owner
last_reviewed: 2026-08-10
review_trigger: identity, release, Git, registry, deployment, provider, credential, or recovery change
---

# TaxKit operational authority

Capability is not authority. Repository access or a runnable command does not
identify the principal permitted to perform a consequential operation. Each
run must bind identity, operation, resource, environment, approval boundary,
duration or revocation, audit receipt, rollback precondition, and escalation.

The repository carries no standing authority for the operations below. Their
principal is `unknown`, so their status is `unknown-stop`:

| Operation | Principal | Status | Required authority receipt |
| --- | --- | --- | --- |
| `versioning` | `unknown` | `unknown-stop` | Named principal; exact package/version train; local checkout; approval scope and duration; before/after manifest receipt; identified revert target. |
| `commit` | `unknown` | `unknown-stop` | Named principal; exact paths, branch and message; approval duration; commit/tree readback; accepted semantic scope and revert owner. |
| `push` | `unknown` | `unknown-stop` | Named principal; remote, branch and expected commit; approval duration; remote SHA readback; prior remote state and recovery authority. |
| `tag` | `unknown` | `unknown-stop` | Named principal; provider, commit and immutable tag; approval duration; provider readback; provider-specific recovery. |
| `release` | `unknown` | `unknown-stop` | Named principal; provider, target commit and hosted release identity; approval duration; release readback; provider-specific recovery. |
| `registry-publication` | `unknown` | `unknown-stop` | Named principal; registry and exact package/version set; credential expiry/revocation; registry readback; deprecation/recovery plan. |
| `deployment` | `unknown` | `unknown-stop` | Named principal; provider-specific app/infrastructure target; environment and duration; provider/runtime readback; tested rollback and reconciliation. |
| `provider-access` | `unknown` | `unknown-stop` | Named principal and identity; exact provider operation/resource/environment; credential duration/revocation; provider receipt; provider-specific recovery. |
| `recovery-mutation` | `unknown` | `unknown-stop` | Named principal; exact recovery target/environment/operation; approval duration; pre/post identity; identified rollback artifacts. |

Read-only local diagnosis and static validation may proceed within the user's
stated task. When any required field is absent, stop before the operation and
escalate to the requesting repository owner. Never infer authority from prior
runs, tool capability, credentials being present, or evidence that a different
principal acted earlier.

The exact machine-checked records live in
`tools/documentation/runbook-contract.json`. That sidecar and this table must
agree; neither grants authority. Provider/registry/deployment claims require
current target-system readback by the authorized principal.

## Dated TaxKit docs deployment envelope

The generic table remains the fail-closed default. Cooper's bounded 2026-07-30
approval is a dated exception only for this implementation goal and the exact
TaxKit docs resources in
`docs/evidence/deployments/2026-07-30-preview-preflight/authority-preflight.json`.
The approving principal is Cooper; the executing principal is the authorized
implementation thread using existing authenticated identities. The receipt
separates credential/account preflight, state bootstrap/adoption, Preview
plan/deploy/destroy, Production plan/deploy, normal rollback/redeploy and
Alchemy reconciliation.

That envelope expires on goal completion, explicit revocation or any
identity/safety mismatch. Cooper's successor Git exception is decoded from
`docs/evidence/deployments/2026-07-30-preview-preflight/git-authority.json`.
It admits one exact `codex/` branch, push, draft pull request and later coherent
accepted-slice pushes. Merge, force-push, branch deletion, conversion to ready,
credential disclosure, rotation or scope expansion, custom-domain/DNS work,
unrelated resources, publication and release remain excluded. Readback belongs
to the operation owner and must retain sanitized Git, account, stage, resource,
state, Worker/deployment/version, URL and postcondition identities.

The original preflight receipt remains a failed historical observation: the
exact local commit was not then a GitHub trusted PR head. The successor
authority permitted the narrow Git recovery. The Schema-decoded
`git-readback.json` receipt now establishes draft PR `#1`, exact head
`669a8f3bc484ddf5975f40940c8bdc14e6f1ba11` and deterministic stage `pr-1`;
it establishes no provider state.

The accepted DCD-002 requalification chain under
`docs/evidence/deployments/2026-07-30-preview-pr-1/` binds candidate
`d9cb8945529fb72158e59ca0daf02a98e1e4de1a` to separate pre-deploy,
deploy/proof, pre-destroy and destroy/absence envelopes. The executing
credential had a broad existing scope set; receipts retain only its sorted
scope digest and required-capability decision, while authority remained
limited to the exact TaxKit two-resource plans. Provider and Alchemy readback
agreed before each mutation, and the final receipt proves the exact Preview
Worker and stage absent. This consumed no Production, rollback, DNS,
publication or broader reconciliation authority. The earlier `0d714e6…`
observation remains historical because it did not retain both pre-mutation
envelopes.

The DCD-003 Production and normal rollback chain under
`docs/evidence/deployments/2026-07-30-production-prod/` consumed only the
already approved fixed `prod` Worker/assets operations and narrow Alchemy
state. Each create/update used a fresh equal plan and immediate credential,
account, stage, provider and state preflight. The successor was independently
qualified in `pr-1` and that stage was removed before its Production update.
Normal rollback used the same source-bound deploy graph and retained the fixed
Worker URL and Alchemy instance while creating a new deployment/version.
Production destroy, direct provider-version selection, custom-domain/DNS work,
credential disclosure or scope expansion remain outside that consumed
envelope. The broad existing OAuth grant remains a capability limitation, not
broader authority.

The resumed 2026-08-02 authority readback is retained at
`docs/evidence/deployments/2026-08-02-authority-capability/receipt.json` and
binds the same approving and executing principals to the named TaxKit docs
resources. It permitted the dated manual Preview, teardown, Production and
source-bound rollback observations retained under the deployment-evidence
route. The readback still found no protected GitHub environment, Actions
secret or repository variable, and no narrow CI token identity. Therefore the
four workflow records remain `not-established`; manual provider receipts do
not substitute for protected workflow proof. The smallest later capability
gate is one account-scoped mutation credential for the three mutation
environments and one read-only credential for report-only inventory, each
with account/resource scope, expiry and revocation-owner readback before
secret attachment. No empty environment or broad OAuth profile may be stored
as a substitute.

### 2026-08-04 — CI credential capability readback

The secure provider connection now resolves account-owned permission groups and
has produced two distinct, time-bounded credentials for this TaxKit-only
implementation goal. The redacted success receipt is
`docs/evidence/deployments/2026-08-04-ci-capability/receipt.json`; it records
the account, resource scope, permission-group identities, expiry and Cooper's
revocation ownership without a token value. The mutation credential is limited
to Workers Scripts Write, Workers Observability Write and Secrets Store Write;
the report-only credential has only the corresponding Read groups. R2, route,
DNS, domain and unrelated provider permissions are not present.

The same receipt records reviewer protection and names-only secret readback for
`taxkit-docs-preview`, `taxkit-docs-production`,
`taxkit-docs-preview-teardown` and `github-actions-report-only`. The Executor
GitHub connector did not expose environment-secret administration, so the
authenticated repository-admin path was used; this is an implementation
observation, not a new standing authority. Secret values remain outside the
repository and the broad local OAuth profile remains excluded from CI.

The mutation workflows use the same narrow mutation identity for one explicit
control-plane preparation: the supported Alchemy login command persists only
the environment-method selector, then the Cloudflare bootstrap command
refreshes the account-matched `cloudflare-state-store` cache on the ephemeral
runner before plan or teardown readback. This is bounded state bootstrap/
adoption authority, not an additional application resource or a report-only
permission. The report-only workflow cannot call that command and remains
unestablished until its independent state/provider read boundary is proven.

This capability epoch clears only the credential/environment gate. The
automation register stays `not-established` until the workflow files are on
the default branch and a fresh exact-candidate run supplies provider/state,
hosted, screenshot, teardown and rollback receipts. Merge, custom-domain/DNS,
publication and unrelated resources remain separate exclusions.

### 2026-08-04 — successor implementation authority

Cooper's current approval extends this implementation goal to the named
workflow and provider operations, PR-ready conversion and merge of PR `#1`,
provided every operation remains bound to the exact TaxKit candidate, account,
stage, resource, protected environment and receipt contract. The first
default-branch Preview dispatch may use the merged PR head only as the bounded
workflow-registration bootstrap required by GitHub; later Preview dispatches
remain open trusted draft-PR operations. Teardown may record a no-op when the
exact stage is absent. Custom-domain/DNS, unrelated resources, publication,
release and credential disclosure or scope expansion remain outside this
approval. Existing historical authority receipts are unchanged.

### 2026-08-05 — default-branch workflow readback and report-only boundary

The reviewed workflow files are now on default branch
`1b6d36b765a5953f79b0932c127f01088603930f`. Under the already recorded
Cooper envelope, Preview plan/deploy (`30962576035`/`30962743727`), corrected
exact-stage teardown (`30964380634`/`30964525980`), PR-close absent-stage
teardown (`30966977503`), Production plan/deploy pairs
(`30964647432`/`30964781776`, `30965270740`/`30965398455`) and normal
rollback (`30965691430`/`30965797032`) read back only the named TaxKit docs
stages/resources. Their sanitized provider, state, hosted and screenshot
receipts are routed under `docs/evidence/deployments/2026-08-05-*`.

The report-only class has not crossed its authority boundary. Run
`30966300887` stopped before inventory because `GH_TOKEN` was not bound; after
the owner correction, `30967000841` reached deployment inventory but a
read-only Cloudflare credential could not derive Alchemy beta.64's HTTP
state-store bearer without the mutation-capable bootstrap path. A successor
workflow may materialize an account-matched
`ALCHEMY_STATE_STORE_CREDENTIALS_JSON` cache and invoke only the inventory
reader. Because beta.64's bearer is not cryptographically read-only, the
successor must retain an operational-read-only limitation, deny every state
write and provider mutation command, and prove that denial in its workflow
contract. No mutation or secret disclosure occurred in the failed epoch. The
deployment register remains `not-established` until a successor run retains
the complete read-only receipt; this is a capability boundary, not a license
to widen the Cloudflare principal.

### 2026-08-10 — current provider and report-only readback

The current authorized implementation epoch retains claim-matched Preview,
exact-stage teardown, fixed Production and normal source-bound rollback
receipts under `docs/evidence/deployments/2026-08-10-*`. The receipts bind the
TaxKit account, exact stage/resource, equal plan digest, Alchemy state, Worker,
deployment/version, workers.dev URL and hosted/screenshot postconditions. The
PR-close teardown receipt keeps its reviewed default-branch implementation SHA
separate from the removed candidate; this is a required authority distinction,
not a second deployment resource.

Protected report-only run `31319845724` passed with the separate read-only
Cloudflare token and protected state-store credential, but its workflow source
was the open branch. It therefore remains an operational-read-only observation
and does not establish the aggregate automation class. A default-branch
readback is required before `externalState` can advance; no authority is
inferred for state bootstrap, deploy, destroy, rollback, DNS, release or
publication from this report.

### 2026-08-10 — current main-sourced Production and report-only authority

The current successor epoch has promoted the fixed Production and report-only
classes separately. Production source
`fef1dfca39d56d28b1f5956e4604af1cc659672b` is represented by
`docs/evidence/deployments/2026-08-10-production-prod-fef1dfc/workflow-receipt-31343392260.json`;
its rollback child receipt is a distinct `production-rollback` operation and
does not broaden deploy authority. Report-only source
`53d93648a7b36713055d3edf69beb681c058386f` is represented by
`docs/evidence/deployments/2026-08-10-orphan-inventory-main-53d936/workflow-receipt-31344401196.json`;
its dedicated report path proves read-only state/provider agreement and no
deletion capability. Preview teardown remains an authority/capability stop:
the beta.64 dry-run returned non-zero before destroy, so no absence receipt or
destructive retry is admitted. Custom-domain/DNS, unrelated resources,
publication, release and credential disclosure remain outside this envelope.
