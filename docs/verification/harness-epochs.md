---
document_type: harness-evaluation-epoch
lifecycle: current
authority: canonical
owner: taxkit-harness-owner
last_reviewed: 2026-07-24
review_trigger: worker, host, tool, runtime, skill, public-boundary, or release-graph change
---

# Harness evaluation epochs

There is no current worker-visible TaxKit epoch while successor
requalification is in progress. `HFI-004-2026-07-24` was accepted against
candidate `03716bfce8e6014e4fa72ec43cb33c487a9c869f`, then invalidated when
HFI-005 proved that its repository profile still contained volatile
active-SPEC/plan lifecycle paths. Its
scenario contract is
[`../../tools/evals/harness-foundation-scenarios.json`](../../tools/evals/harness-foundation-scenarios.json);
the independent reviewer record remains outside that default worker context.
The invalidated target is commit `03716bfce8e6014e4fa72ec43cb33c487a9c869f`,
tree `bb0300c3d02a11c9f30e6dc7cd6c8659bc3f51fa`, after the canonical skill,
profile, governance, path-fixture and Git owner-execute corrections.

The invalidated source manifest, candidate and validation remain reachable,
while five terminal attempt records—including the rejected stable-profile
candidate—and its five local journey receipts remain transitional evidence
under
[`epoch-candidate.json`](../documentation-audit/harness-foundation/epoch-candidate.json)
and
[`epoch-validation.json`](../documentation-audit/harness-foundation/epoch-validation.json).
The focused epoch graph is expected to reject that mixed transitional state;
it must be replaced only after a new immutable successor passes. Candidate
`f12c324` correctly embeds the stable profile but cannot qualify because its
gate accepts the old volatile lifecycle/owner shape. Successor `7c8a96e`
contains the fail-closed correction and passed five fresh journeys, exact
focused epoch validation, and fresh independent acceptance. It remains pending
HFI-005 current-owner and lifecycle reconciliation before this owner promotes
it as the current worker-visible epoch.

The five current journeys are calculator, packed SDK consumer, HTTP API,
documentation runtime, and report-only release readiness. Their command,
boundary oracle, receipt and recovery owner live in the scenario contract.
Those commands establish local observations only; they never establish hosted
CI, Git publication, registry state, deployment, provider state, public-site
availability, or a future epoch.

Four clocks are independent: worker feedback latency, worker wall-clock,
synchronous human attention, and time to accepted outcome. Record a value only
from direct measurement for that clock. Otherwise retain `null` with its reason;
never infer it from a timestamp, another clock, or narrative.

HGI-206 remains the previous retained epoch for target
`a8a58882cd6c5f8003d31dc0c0567d78093597b9`; its scenario, candidate,
validation and lifecycle-correction evidence remain reachable under
`tools/evals/hgi-206*` and `docs/documentation-audit/HGI-206*`. It cannot
qualify the later skill or governance state and is not restored as current
truth.

Failed, rejected, deferred and inconclusive material remains under
`docs/documentation-audit/` and is not acceptance proof. Reversal of the
current epoch is limited to reverting its task-scoped evidence/owner commits,
restoring HGI-206 as the previous retained route, and preserving every terminal
receipt. Any worker, host, tool, runtime, skill receipt, repository profile,
validator, journey, target or authority change requires requalification.
