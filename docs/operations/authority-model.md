---
document_type: authority-model
lifecycle: current
authority: canonical
owner: taxkit-authority-model-owner
last_reviewed: 2026-07-30
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
