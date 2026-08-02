---
document_type: standard
lifecycle: current
authority: canonical
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-02
review_trigger: public boundary, workflow, action, release graph, or repeated-review finding change
---

# Controls and automation governance

The Quality workflow is the executable CI owner for the local release-facing
graph. It has read-only repository permission, a timeout, cancellation
concurrency, an explicit `taxkit-ci-release-maintainer` pin-update owner, and
full-SHA action pins. It invokes `bun run release:check -- --ci` on every
configured pull request and push; there are deliberately no path filters, so a
new or renamed release boundary cannot be skipped. The only preceding run
steps materialise complete `main` comparison history and install Chromium
through the frozen app-local Playwright executable; a shallow checkout or
floating browser-tool resolution fails policy. The Schema-decoded workflow,
control register and negative corpus are owned by `tools/quality-workflow/` and
run through `bun run check:quality-workflow`.

| Signal and named failure | Owner, fixture, evidence and recovery | Review trigger | Retirement |
| --- | --- | --- | --- |
| Workflow change; a floating action/browser tool, shallow or ambiguous base history, write permission, unbounded run, other-job/comment spoof, or bypassed graph | `tools/quality-workflow/controls.json` entry `quality-workflow-semantics`; `policy.test.ts`, `check:quality-workflow`, bounded tagged finding and recovery | Workflow, action, browser dependency, public-boundary, or release-graph change | A stronger schema-decoded workflow policy replaces this exact contract. |
| Release-relevant revision; a boundary passes a partial local CI graph | `controls.json` entry `canonical-release-graph`; `@taxkit/scripts` CI report with owning failed command | Package, API, SDK, docs, manifest, workflow, or release-script change | A stronger canonical graph owns all nine ordered checks. |
| Proposed recurring context work; untrusted output enters canonical context or corroborates itself | `controls.json` entry `context-candidate-admission`; Schema-decoded report-only envelope | Candidate source, retrieval, reviewer, publisher, retention or recovery change | A separately accepted canonical context-governance owner replaces this contract. |

Controls are admitted only when their exact signal, prevented failure, owner,
fixture, evidence route, recovery, review trigger, and retirement condition
match the Schema-decoded register. Repeated findings move to the earliest
enforceable owner. The workflow configuration and local checks do not prove a
hosted run, publication, registry state, deployment, provider state, or external
consumer behaviour.

Docs deployment automation has a separate narrow control register at
[`tools/docs-deployment/controls.json`](../../tools/docs-deployment/controls.json).
Its Schema and negative fixtures admit only these controls:

| Signal and named failure | Owner, fixture, evidence and recovery | Review trigger | Retirement |
| --- | --- | --- | --- |
| Candidate selection; fork, stale SHA, failed Quality result or candidate execution through `pull_request_target` reaches credentials | `docs-workflow-candidate-trust`; `tools/docs-deployment/automation.policy.test.ts`; repair exact trusted source/default-branch binding and issue a new attempt | Trigger, checkout, Quality, principal or candidate change | Stronger accepted workflow identity policy preserves exact-source proof. |
| Preview, Production or teardown mutation; cancellable or weak stage locking bypasses equal replan or readback | `docs-workflow-mutation-lock`; deployment policy check; restore the non-cancellable stage lock and accepted/equal plan contract | Concurrency, plan, approval, state or provider change | Stronger provider-aware distributed lock replaces repository orchestration locking. |
| Pull request closes; teardown executes candidate code or derives a target other than exact `pr-N` | `docs-preview-teardown-safety`; stop and return to reviewed default-branch code plus manual exact-stage recovery | Close trigger, checkout, stage derivation or destroy change | Stronger accepted Preview lifecycle preserves reviewed-code and exact-stage proof. |
| Orphan inventory; partial inventory gains provider mutation or automatic deletion | `docs-orphan-report-only`; retain an inconclusive report and require separate teardown authority | Inventory source, schedule, credential, classification or retirement change | Separately accepted lifecycle owner replaces report-only classification without weakening non-mutation. |

`bun run check:docs-deployment-automation` proves these local records and
cross-field invariants only. It currently reports zero externally established
deployment automations. Workflow YAML, protected environments, credential
storage and hosted receipts remain required before the controls can claim
operational enforcement.

The dated manual Preview/Production/rollback receipts under
`docs/evidence/deployments/` prove the same candidate, plan, provider/state and
hosted contracts for an authorized operator epoch, but they do not change
`externalState.status` or establish GitHub workflow enforcement. A protected
environment and a concrete narrow credential identity must be read back before
any automation record moves to `established`.

The separate provider-bound `bun run check:docs-deployment-orphans` command
executes only the admitted open-PR, state and Worker reads. Its receipt Schema
fixes `mutationCapability` to `none` and `automaticDeletion` to `prohibited`;
the policy recomputes classifications from the embedded source inventories so
a false active/orphan label fails validation.
