---
document_type: harness-evaluation-epoch
lifecycle: current
authority: canonical
owner: taxkit-harness-owner
last_reviewed: 2026-07-24
review_trigger: worker, host, tool, runtime, skill, public-boundary, or release-graph change
---

# Harness evaluation epochs

The current worker-visible TaxKit epoch is `HFI-004-2026-07-24`, qualified
against candidate `7c8a96e35ed59e4f78490d229cbfdcf21ea18ec0`, tree
`637bc0e2145ea24be7b2a72d507f9f99a43e5a72`, from migration base
`8695c018accf4c4abb7e803c631c5120f90e52b2`. Git reproduces 135 changed
paths and the NUL-delimited path digest
`18a0f7f2f43cae8428e50376b0ca9ddce400b8f4fba280ca1a1e209e096fa5c6`.
Its scenario contract is
[`../../tools/evals/harness-foundation-scenarios.json`](../../tools/evals/harness-foundation-scenarios.json);
the independent reviewer record remains outside that default worker context.

The source manifest, five fresh local journey receipts, five terminal
predecessor attempts, fresh independent acceptance, four clocks, limitations,
non-claims, and focused validation are hash-bound under
[`epoch-candidate.json`](../documentation-audit/harness-foundation/epoch-candidate.json)
and
[`epoch-validation.json`](../documentation-audit/harness-foundation/epoch-validation.json).
The candidate contains the complete stable TaxKit profile and a governance
policy that rejects the previous volatile lifecycle/owner shape. The focused
epoch verifier also distinguishes required epoch/effectiveness owner changes
from preserved HGI evidence. Any source, receipt, review, or target mismatch
fails closed.

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
retaining HGI-206 as the previous route, and preserving every terminal receipt.
Any worker, host, tool, runtime, skill receipt, repository profile, validator,
journey, target or authority change requires requalification.
