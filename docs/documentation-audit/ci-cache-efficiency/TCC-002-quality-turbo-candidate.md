---
document_type: audit-evidence
lifecycle: evidence
authority: supporting
owner: taxkit-ci-release-maintainer
last_reviewed: 2026-08-20
review_trigger: TCC-002 source, hosted Quality run, Turbo task, cache credential, event mode, fallback, or acceptance change
---

# TCC-002 Quality Turbo candidate

## Current decision

TCC-002 remains an implementation candidate until the same source revision has
claim-matched pull-request, trusted-main and forced-uncached evidence. The local
policy, task graph and fallback proofs below admit a hosted pull-request spike;
they do not yet accept the slice.

## Candidate call graph

~~~text
Quality pull request or push to main
  -> complete-history checkout
  -> live Bun setup and frozen install
  -> live Chromium and system-dependency install
  -> Turbo-backed quality policy check
  -> live @taxkit/scripts report-only orchestrator
       -> Turbo-backed verification leaves
       -> Turbo-backed test leaves
       -> Turbo build graph
       -> Turbo docs validation
       -> Turbo SDK packed-artifact and downstream checks
       -> Turbo API smoke
       -> Turbo docs browser proof
       -> Turbo Changeset status
  -> true ordered exit status and bounded CI report
~~~

Pull requests set `local:rw,remote:r`; pushes to `main` set
`local:rw,remote:rw`. A fork receives no repository secret. The workflow keeps
one job, `contents: read`, complete history, its existing timeout,
concurrency/cancellation and exact nine-check release graph. It does not add
`pull_request_target`, path filters, a second job or cache-only success.

## Local evidence

- The focused Quality policy suite passed 13 tests, including rejection of a
  missing team/token binding, pull-request remote writes and step-level cache
  overrides.
- The release-readiness suite preserved all nine check identities and order
  while changing checks five to nine to canonical root Turbo wrappers.
- A host-permission local run of `check:quality-workflow` recorded one cache
  miss in 393 ms and an immediate same-hash cache hit in 74 ms.
- A run with `TURBO_CACHE=local:rw,remote:r`, the approved team and no token
  printed the bounded remote-disabled fallback and passed the real policy
  command. This proves a missing credential does not create false success.
- Turbo dry graphs resolve the root Quality task, docs-content validation and
  SDK packed-artifact dependencies without a self-recursive wrapper.
- The complete report-only release graph passed all nine checks with the
  TaxKit smoke-port override because an unrelated local development server
  already owned the default port. The same source then passed all nine checks
  again with `TURBO_FORCE=true`, including API and browser proof.

These observations prove local task routing and fallback only. They do not
prove a Vercel upload/download, GitHub-hosted execution, main authority,
deployment, publication, registry state or public availability.

The local mandatory gates passed: Quality policy and its focused suite,
release-readiness tests, documentation and runbook checks, repository-path
check, lint, formatting, forced 14-task build, forced 23-task type check,
ordinary nine-check CI graph, forced nine-check CI graph and diff whitespace.
The first un-overridden API smoke attempt stopped with a true non-zero exit
because port 4173 was already in use; no process was killed or hidden.

## Input, output and log review

- Repository-wide files that affect all tasks are explicit global
  dependencies. Build tasks declare runtime/build environment inputs and their
  generated output directories.
- Validators and tests with no durable output declare an empty output list;
  documentation and runbook validators retain only their existing ignored
  report files.
- Persistent development and cleanup remain uncached. Provider, candidate,
  artifact, receipt and hosted-readback commands remain live.
- `TURBO_TOKEN` and `TURBO_TEAM` configure the cache client; they are not task
  inputs or outputs. No bearer value is retained in source or evidence.

## Documentation impact

| Owner | Decision | Reason |
| --- | --- | --- |
| Root and scripts READMEs | Change required | The canonical commands now route deterministic leaves through Turbo. |
| Testing architecture | Change required | It owns the release graph, task classification, event modes and proof limits. |
| CI controls and automation register | Change required | They own pull-request read-only/main read-write authority and fallback. |
| Release-readiness runbook | Change required | It must explain optional local remote-cache use and uncached proof. |
| Deployment architecture/runbook | Preserve for TCC-002 | Trusted workflow cache changes start in TCC-004. |
| API, SDK and public docs contracts | N/A | No runtime or package contract changes. |
| Changeset | N/A | Repository tooling and CI configuration only. |

## Hosted acceptance still required

Hosted pull-request run
[32323001841](https://github.com/crcorbett/taxkit/actions/runs/32323001841)
attempt 1 passed the complete Quality job for source `44a5137` in 5m25s. It
retained the pull-request mode `local:rw,remote:r`, masked `TURBO_TOKEN`,
completed Chromium setup and passed the full browser/release graph. Turbo then
reported remote caching unavailable because it could not connect to
`https://vercel.com/api`, so it ran locally with zero remote hits. This is
valid fallback proof, not remote-cache acceptance.

Current official Turbo guidance requires a team-scoped personal access token
for GitHub Actions Remote Cache. The failed token was project-scoped, so the
accepted correction was a bounded expiring team-scoped token, an updated
encrypted GitHub secret and 1Password item, a rerun of the exact event, then
revocation of the non-working token after successful readback. No deployment
or Git link was required.

That correction is complete. Attempt 2 of the same run and source passed in
5m02s of worker time. Bun installation took 17s, Chromium setup took 23s, and
the complete nine-check release graph took 4m16s including docs browser proof.
Turbo reported `Remote caching enabled`, then one remote miss for the Quality
policy task and `Remote cache is read-only, skipping upload`. There was no
connection warning. This proves the team-scoped replacement can read the
Remote Cache service and that pull-request execution does not upload. It does
not prove a remote hit because no trusted run has seeded this task hash.

Names-only readback retained current token
`taxkit-turbo-ci-team-2026-08-20`, team
`team_1LX7ZujbijowTv8J9k0aU7nD`, expiry 2026-11-18, GitHub secret
`TURBO_TOKEN` updated at `2026-08-20T02:31:29Z`, and the renamed Corbett Family
`taxkit` 1Password item. The superseded project-scoped token was revoked after
attempt 2 and no longer appears in Vercel's active-token list. No bearer is in
the repository or evidence.

Remaining acceptance steps:

1. Treat attempt 1 as the hosted cache-unavailable/fresh-run observation and
   retain the complete browser postcondition; local `TURBO_FORCE=true` proof
   separately confirms forced execution of the same nine-check graph.
2. After separately authorised merge/default-branch publication, record a
   trusted-main remote write followed by a hit for an eligible task.
3. Rerun the pull request after the trusted seed and record a remote hit without
   a pull-request upload.
4. Accept, revise or remove TCC-002 from those observations before TCC-003.

Rollback removes the three Turbo workflow bindings and restores the direct
leaf command entrypoints while preserving the complete nine-check graph.
