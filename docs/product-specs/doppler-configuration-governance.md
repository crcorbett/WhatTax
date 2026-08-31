---
document_type: product-spec
lifecycle: active
authority: canonical
owner: taxkit-platform-owner
last_reviewed: 2026-08-31
review_trigger: Doppler project or config change, credential lifecycle change, deployment input change, GitHub workflow change, Alchemy or Cloudflare configuration change, or secret-evidence incident
successor: null
tombstone: false
status: canonical
source_of_truth: docs
confidence: high
---

# Doppler configuration governance

## Overview

TaxKit will use Doppler as the governed source for credentials and operator-set
environment values needed by local credentialed development, GitHub Actions,
Alchemy and Cloudflare. Doppler will not own values created by the host,
GitHub, Alchemy or TaxKit's evidence tools.

The first working slice is deliberately small: one local credentialed docs
command. The Quality workflow's two Turbo values and receipt reconciliation
follow as the first hosted-source repository slice. Preview and teardown then
use their separate provider config and secret-negative artifact boundary.
Production follows only after that slice is accepted.
The existing native Alchemy resource graph, stage names, locks, equal replan,
provider readback, hosted proof and recovery rules remain unchanged.

No Doppler project or TaxKit GitHub Doppler bridge existed at the
research baseline. Repository implementation may proceed, but creating or
changing Doppler, GitHub or Cloudflare credentials remains a separate
provider operation under the
[authority model](../operations/authority-model.md).

Repository implementation through DCG-004 is accepted: local development,
Quality, receipt reconciliation, Preview, exact-stage teardown, Production and
normal rollback now have one reviewed Doppler source path each. No live TaxKit
config, GitHub bridge, hosted fetch or provider result is claimed before the
separately approved DCG-005 operation.

The separately approved DCG-005 bootstrap completed on 31 August 2026. The
`taxkit` project now has exactly `dev`, `ci`, `stg_preview` and `prd`; the three
automation configs have separate read-only expiring service tokens; GitHub has
the three named bridge secrets; and local TaxKit development has a
repository-scoped personal login. The retained direct GitHub values remain for
rollback and are not read by the new workflow source. The dated
[bootstrap receipt](../evidence/deployments/2026-08-31-doppler-bootstrap/receipt.json)
owns the exact identities and secret-negative readback. Provider deployment,
merged-main proof and legacy cleanup remain separate proof or authority
boundaries.

## Problem

At the research baseline, TaxKit read Turbo and Cloudflare inputs directly from
GitHub secrets and variables. The local Alchemy command could also inherit
whatever was present in the developer's shell, Bun `.env` files or Alchemy's
own default `.env` loader. Its default `dev_<user>` stage was rejected by the
deployment-only `pr-N`/`prod` decoder, so the documented local command was not
a complete working path. The values were not governed from one environment
model, and deployment workflows could upload broad runner temporary
directories containing raw plan or error files.

This created four practical risks addressed by this SPEC:

- a developer can unknowingly use the wrong environment or a stale local
  fallback;
- Preview and Production custody can drift because each GitHub secret is
  managed separately;
- a secret can reach later steps, caches or evidence that did not need it; and
- local or hosted proof can show that a command passed without proving which
  governed environment supplied its inputs.

## Research baseline

Research was read-only. Reference repositories were evidence, not TaxKit
policy. Their local paths, project names, secret values and private assumptions
must not appear in TaxKit's durable implementation.

| Evidence | Exact revision or version | Use |
| --- | --- | --- |
| TaxKit source | `d2f7a3b4b90c54d4e930b438c42a29f1a89c60df` | Current code, docs and workflows |
| TaxKit Bun pin | `1.3.14`; commit `0d9b296af33f2b851fcbf4df3e9ec89751734ba4` | Required repository runtime |
| Research host Bun | `1.4.0` | Mismatch to disclose; not proof for the pinned runtime |
| Doppler CLI | `3.76.5`; annotated tag object `12ca88c1227bf21ab45199b0ff6e07541c0956d9`, commit `a8671b86a839187fcbfdbd449fc5787dc62ab42f` | Local command contract |
| Doppler secrets action | `v2.0.0`; `451892f16195f9ac360e1a5bcbf0b5fd0e957534` | Immutable GitHub fetch boundary |
| Alchemy | `2.0.0-beta.64`; `31edd3c4b2f0f3310fad07f5423aee20cf72be8d` | Existing native deployment graph |
| Effect | `4.0.0-beta.100` | Typed and redacted configuration boundary |
| Cloudflare Vite plugin | `1.47.0` | Existing docs runtime |
| Wrangler | `4.114.0`; Workers SDK commit `16b3d5a48005c7d92112470119ba96019071e59e` | Provider readback |
| setup-bun action | `v2.2.0`; `0c5077e51419868618aeaa5fe8019c62421857d6` | Current workflow pin; comments incorrectly say `v2.0.2` |
| Bundjil evidence | `276c7fdb665c3aac0cbd8f302ffacbf030317140` | Typed and redacted Alchemy comparison |
| Site evidence | `086f05d5470b9a6db26d3fc1039ae8a2c5e3e9c8`, five commits behind its origin at inspection | Older Doppler workflow comparison only |
| Pollsor evidence | `013d276e353753ee0727aa56e4f303dbc963780f`, three commits ahead of its origin at inspection | Fixed root wrappers, named action outputs and fork fallback comparison |

Official guidance checked on 28 August 2026 includes Doppler CLI, service
tokens, fallbacks, branch configs and GitHub OIDC; Bun environment loading;
GitHub secure workflow and cache use; Alchemy state and stages; and Cloudflare
CI and account-owned token guidance. Exact links are in [References](#references).

## Current and target call graphs

```ts
Local credentialed docs development: current

developer shell or Bun .env files
  -> bun run docs:dev:cloudflare
    -> alchemy dev
      -> Schema-decoded TaxKit/Alchemy config
      -> Cloudflare
```

```ts
Local credentialed docs development: target

scoped Doppler login
  -> root fixed adapter strips ambient Doppler and governed provider values
    -> Doppler selects taxkit/dev with env config and fallback disabled
      -> Bun runs with automatic .env loading disabled
        -> internal alchemy dev command uses an intentionally empty env file
          -> separate Schema-decoded dev_<user> stack stage
          -> existing redacted Cloudflare config
          -> Cloudflare
```

```ts
GitHub provider work: current

GitHub repository or protected-environment secrets and variables
  -> broad job or provider-step environment
    -> existing Alchemy/Cloudflare plan, deploy, teardown or readback
      -> broad runner temporary evidence directory upload
```

```ts
GitHub provider work: target

GitHub config-scoped Doppler bridge
  -> immutable Doppler fetch action after cache save
    -> expected safe Doppler project/config metadata check
      -> named outputs on the exact consumer step only
        -> existing typed Alchemy/Cloudflare operation
          -> allowlisted, secret-negative evidence preparation
            -> artifact upload
```

```ts
Quality: target

fork pull request
  -> no Doppler token and no fetch action
  -> credential-free Quality path

trusted pull request or main
  -> repository taxkit/ci bridge
  -> named TURBO_TEAM and TURBO_TOKEN outputs on Turbo steps only
  -> same Quality checks
```

## Goals

- Define one clear owner for TaxKit's operator-set credentials and environment
  values.
- Fail before provider work when a required value is missing, malformed or
  from the wrong environment.
- Keep secret values out of source control, command arguments, logs, caches,
  receipts and uploaded evidence.
- Give each local command and GitHub workflow only the named values it needs.
- Keep Preview and Production separate in Doppler, GitHub environments,
  Alchemy stages and provider authority.
- Preserve credential-free fork pull-request verification.
- Preserve TaxKit's native Alchemy design and current proof strength.
- Provide a bounded bootstrap, rotation, recovery and rollback procedure.

## Non-goals

- Do not publish packages, change DNS or domains, or deploy unrelated
  resources.
- Do not replace Alchemy, Cloudflare, Turbo, GitHub environments or TaxKit's
  evidence model.
- Do not put Alchemy's generated state-store bearer or encryption key into
  Doppler. Alchemy continues to own those internal state values.
- Do not put host-created values such as `CI`, ports, runner paths, GitHub event
  data, Playwright paths or TaxKit evidence-file paths into Doppler.
- Do not commit a Doppler export, fallback file, service token or secret hash.
- Do not add a general secret-management framework or a provider wrapper.
- Do not claim hosted execution, provider state, rotation or revocation from
  local tests.
- Do not remove legacy GitHub credentials until the merged-main Doppler path is
  independently proven and a separate removal operation is approved.

## Ownership and trust boundaries

### Configuration classes

| Class | Owner | Examples | Rule |
| --- | --- | --- | --- |
| Secret deployment input | Doppler | `CLOUDFLARE_API_TOKEN`, `TURBO_TOKEN` | Fetch only for the exact environment and consumer |
| Non-secret operator input | Doppler | `CLOUDFLARE_ACCOUNT_ID`, `TURBO_TEAM` | Govern with the related secret so identity cannot drift |
| Repository policy | Git and TaxKit docs/code | project/config names, action SHA, Alchemy profile, stage mapping | Reviewable and non-secret |
| Host or platform input | Host, GitHub or runner | `CI`, `PORT`, GitHub event/ref/SHA, runner paths | Never copied into Doppler |
| Alchemy internal state | Alchemy and Cloudflare Secrets Store | state-store bearer, encryption key, injected-state marker | Native exception; never exported to Doppler or evidence |
| Test/evidence input | TaxKit evidence owner | `TAXKIT_WORKFLOW_*`, fixture paths, sentinel values | Deterministic, non-production and not governed secret material |
| Public build input | App owner | deliberately public Vite values | Must not be confused with credentials |

### Environment map

| TaxKit purpose | Doppler config | GitHub scope | Allowed named values | Alchemy stage |
| --- | --- | --- | --- | --- |
| Local credentialed docs work | `dev` | None; scoped developer login | Cloudflare account and development token only | Alchemy-owned `dev_<user>` decoded by a local-only stack-stage Schema |
| Quality and receipt reconciliation | `ci` | Repository `DOPPLER_CI_TOKEN` bridge | Turbo team/token only | No deploy stage |
| Preview and teardown | `stg_preview` | `taxkit-docs-preview` `DOPPLER_PROVIDER_TOKEN` bridge | Cloudflare account/token only | Exact `pr-<number>` in hosted workflows |
| Production and rollback | `prd` | `taxkit-docs-production` `DOPPLER_PROVIDER_TOKEN` bridge | Cloudflare account/token only | Fixed `prod` |

TaxKit has no fixed staging deployment. It therefore does not create an unused
`stg` config. Preview is named `stg_preview` to make its non-Production purpose
plain while preserving the existing `pr-<number>` Alchemy stage rule.

### Credential lifecycle

The reviewed implementation uses one read-only, expiring service token for
each automation config: `ci`, `stg_preview` and `prd`. `ci` is stored at
repository scope as `DOPPLER_CI_TOKEN`. `stg_preview` and `prd` are each stored
as `DOPPLER_PROVIDER_TOKEN` in their different protected GitHub environments.
Preview and Production therefore never share a token. Local `dev` deliberately
has no service token or GitHub bridge; the named developer's checkout-scoped
Doppler login reads that config. Each config contains only the named values in
the table, and every required TaxKit value uses masked visibility in Doppler.

Exact-claim GitHub OIDC is a preferred future successor if the live Doppler
plan and current repository subject support it. That successor needs a new
review because it changes job permissions, identity inputs and recovery. The
current workflow must not carry two authentication modes.

Creation, import, rotation and revocation require the exact principal,
resource, environment, change, rollback, readback and approval described in
the authority model. Token values must move only through provider and GitHub
secret-entry interfaces; they must never pass through chat, a shell argument,
source, a patch, a log or an evidence file.

## Requirements

### `DCG-RQ-001` — Fixed local command boundary

Credentialed root commands must explicitly select project `taxkit` and their
config. A narrow fixed adapter must remove ambient `DOPPLER_TOKEN`,
`DOPPLER_PROJECT`, `DOPPLER_CONFIG` and governed provider values before
starting Doppler. It must run Doppler with `--no-read-env`, `--no-fallback`,
`--no-check-version` and `--only-secrets`, then run Bun with `--no-env-file`.
The internal Alchemy command must use a committed, intentionally empty env-file
input so Alchemy cannot load a developer `.env`. Ordinary `bun run dev`
remains credential-free.

No committed `.doppler.yaml` is required because root commands own the fixed
selection. This avoids a second selection owner. Onboarding must use
`doppler login --scope=./`, explain that checkout moves require a new scoped
login, and run a narrow repository custody check that prints only pass/fail.
It must not use `doppler configure debug`, whose 3.76.5 source can print a raw
token when keyring storage has failed. If the token is not a `secret-...`
system-keyring reference, onboarding stops and directs the developer to repair
keyring custody without printing the stored value.

Alchemy `2.0.0-beta.64` defaults local development to `dev_<user>`. TaxKit must
add a separate local stack-stage Schema for that exact safe pattern and use it
only at root Alchemy composition. The existing `DocsDeploymentStage` remains
strictly `pr-N | prod` for workflow inputs, receipts, provider readback and
hosted proof. This repairs local development without weakening Preview or
Production controls.

### `DCG-RQ-002` — Typed and redacted consumer boundary

Alchemy and TaxKit keep decoding required values before provider calls.
Secret values remain redacted through Effect `Config.redacted` or the existing
provider boundary. Missing, blank, malformed or identity-mismatched config
must fail before mutation. No new raw `process.env` parser, unchecked cast,
provider client wrapper or duplicated config schema is allowed.

### `DCG-RQ-003` — Narrow GitHub fetch boundary

GitHub workflows use
`dopplerhq/secrets-fetch-action@451892f16195f9ac360e1a5bcbf0b5fd0e957534`
with `inject-env-vars` absent or false. Workflows map only named outputs onto
the exact step that needs them. The bridge token is step-local to the fetch
action. Cache restore and save complete before the fetch. No cache is saved
after secret access. A safe metadata step checks `DOPPLER_PROJECT=taxkit` and
the exact expected `DOPPLER_CONFIG` before any fetched value reaches a
consumer. Those action metadata outputs are deliberately unmasked; no TaxKit
value may use unmasked visibility.

### `DCG-RQ-004` — Trusted and untrusted Quality paths

Fork pull requests never fetch Doppler and run the current credential-free
Quality path with local Turbo caching only. Trusted pull requests and main may
fetch the `ci` config and pass only Turbo values to Turbo-backed steps. Receipt
reconciliation uses the same `ci` bridge because it needs only those Turbo
values. The tests must prove both paths from workflow source without requiring
live secrets.

### `DCG-RQ-005` — Preview and Production isolation

Preview and teardown use only `stg_preview` provider values through the Preview
GitHub environment. Production and normal rollback use only `prd` provider
values through the Production environment. Preview and Production workflows
may separately fetch the repository-scoped `ci` config for Turbo, but that
config contains no provider value. Static config, metadata checks, stage locks
and runtime checks must make cross-environment use fail closed. Production
credentials must not be available to Preview, teardown, Quality, receipt or
fork jobs.

### `DCG-RQ-006` — Native Alchemy preservation

The change may supply inputs to the existing Alchemy boundary only. It must
not change the one `TaxKitDocsCloudflare` app, one
`Cloudflare.Website.Vite("DocsWebsite")` resource, `pr-<number>`/`prod`
stages, state ownership, equal plan/replan, exact-stage teardown, provider
readback, hosted journey or rollback meaning.

### `DCG-RQ-007` — Secret-negative logs and evidence

Raw Alchemy plan, replan, destroy, provider stderr, environment dumps and
unfiltered hosted output remain runner-local and are never uploaded.
Workflows prepare a separate allowlisted upload directory containing only
decoded, projected and sanitized evidence owners. Before upload, a deterministic
sentinel test and repository policy test must reject secret values, structured
secret material, forbidden credential files and broad runner-directory paths.
Failure output names the failed boundary or file, never the value, its prefix,
suffix, transformation or hash.

### `DCG-RQ-008` — Secret-negative caches

Only the existing Bun package and Playwright browser paths may be cached.
`.doppler`, Doppler fallback/export files, `.alchemy`, `.wrangler`, mounted
secret files, runner credential files and deployment evidence directories are
forbidden cache inputs. Fork-restored caches remain untrusted inputs.

### `DCG-RQ-009` — Failure and recovery

- Missing Doppler authentication or config fails before the child command.
- Ambient Doppler or governed provider values cannot override the fixed local
  selection or reach the Alchemy child.
- A Doppler outage fails closed because fallback files are disabled.
- Missing or malformed named values fail at the typed consumer boundary.
- A failed fetch does not fall back to direct legacy GitHub secrets.
- Rotation proves the replacement at the intended environment, changes the
  bridge, reads back access and only then requests old-token revocation.
- Recovery may temporarily restore the retained direct GitHub path only through
  a reviewed repository rollback and exact environment readback. It must not
  silently mix sources in one workflow.
- Existing Alchemy state recovery remains unchanged.

### `DCG-RQ-010` — Migration and proof ceiling

Repository slices land in this order:

1. local wrapper, source-neutral internal command, docs and deterministic
   wrapper tests;
2. Quality/receipt named-output path and fork fallback;
3. Preview/teardown named-output path and secret-negative artifact boundary;
4. Production/rollback path and recovery documentation; and
5. separately approved provider bootstrap, hosted proof, legacy cleanup and
   final closeout.

Legacy GitHub values remain during rollback overlap, but new workflow source
must have exactly one active source path. Local and deterministic tests prove
repository behaviour only. Hosted runs prove workflow behaviour for their
exact commit. Provider readback proves only the named environment and resource.

## Bootstrap and external operation envelope

Before any provider mutation, the operator must present one operation record
containing:

- principal: the named TaxKit/Doppler/GitHub/Cloudflare operator;
- resources: Doppler project `taxkit`; configs `dev`, `ci`, `stg_preview` and
  `prd`; exact existing GitHub repository/environments; and no other project;
- change: create missing project/configs, enter only the approved named values
  with masked visibility, create one read-only expiring service token for each
  of `ci`, `stg_preview` and `prd`, set repository `DOPPLER_CI_TOKEN`, and set
  separate environment `DOPPLER_PROVIDER_TOKEN` bridges for Preview and
  Production; `dev` keeps the separately approved personal-login path and gets
  no service token;
- environment: development, CI, Preview or Production named separately;
- least privilege: read-only single-config access, expiry where supported and
  current measured Cloudflare permissions;
- rollback: retain the old GitHub values until the merged-main path passes,
  disable the new bridge, and revert the workflow commit if proof fails;
- readback: config names and required key names only, identity scope/expiry,
  GitHub secret metadata, exact workflow SHA and provider result; and
- non-claim: no secret value, hash, provider mutation beyond the named scope,
  publication, DNS or unrelated deployment.

The operation stops if a token cannot be read-only and config-scoped, required
values cannot use masked visibility, the Cloudflare permission set is
unmeasured, or any value would need to pass through a log or evidence file.
GitHub cannot return the existing Turbo or Cloudflare secret values, so the
approved operation must name their separate secure source or separately
authorise replacement credentials. It must not add a migration workflow merely
to move those values between providers.

## Tests and verification

Deterministic repository proof must include:

- exact root wrapper arguments, fixed project/config selection,
  `--no-fallback`, `--only-secrets` and Bun `--no-env-file`;
- a fake Doppler executable showing the child receives only the named values
  and no fallback is read or written;
- missing and malformed configuration failure before provider work;
- workflow policy tests for the full action SHA, no broad injection, named
  outputs, fetch-after-cache ordering and no direct legacy secret reads;
- fork Quality proof without a token;
- Preview/Production config and GitHub environment isolation;
- secret sentinel rejection in logs and prepared artifacts;
- allowlisted artifact and cache paths, including negative fixtures;
- existing Alchemy configuration, stage-lock, plan, evidence and workflow
  contract tests; and
- `bun run check:docs`, `bun run check:runbooks`,
  `bun run check:repository-paths`, `bun run verification`, JSON parsing and
  `git diff --check`.

Safe hosted proof, once separately authorised, must bind the exact candidate
SHA and show:

- trusted Quality success and fork credential-free behaviour;
- Preview plan/deploy/hosted proof and exact-stage teardown absence;
- fixed Production plan/deploy/hosted proof and normal rollback/redeploy;
- receipt reconciliation from its least-privilege environment;
- expected Doppler project/config metadata without any value; and
- secret-negative uploaded artifacts and no post-fetch cache save.

## Risks and trade-offs

- Doppler adds a provider dependency. Failing closed is safer than using stale
  fallback data, but local and CI work needing governed values will stop during
  an outage.
- Service tokens leave long-lived bridges in GitHub. Separate, read-only,
  expiring tokens bound to one config reduce the impact. Exact-claim OIDC is a
  future reviewed successor, not a second path in the current workflow.
- Named action outputs still exist in the job process boundary. Step-local
  mapping and no broad injection reduce exposure but do not make careless
  logging safe.
- Keeping legacy GitHub values during rollback overlap temporarily duplicates
  custody. They are not referenced by new source and are removed only after
  exact merged-main proof and separate approval.
- A stricter evidence allowlist may initially omit a useful diagnostic. Raw
  files stay runner-local; a reviewed sanitized projection can be added later.

## Downstream impact ledger

| Surface | Decision | Evidence and required task |
| --- | --- | --- |
| Canonical architecture | Change required | `docs/architecture/configuration.md` and `docs/architecture/deployment.md`; DCG-001 through DCG-004 |
| Operations and runbooks | Change required | `docs/operations/authority-model.md`, `docs/operations/automation-register.md`, `docs/runbooks/docs-deployment.md`, `docs/runbooks/recovery.md`; DCG-001 through DCG-005 |
| Root and app READMEs | Change required | `README.md`, `apps/docs/README.md`; DCG-001 and DCG-004 |
| Product SPEC, task list and plans | Change required | This SPEC, sibling ledger, active plan and indexes; every task |
| Root scripts and manifests | Change required | `package.json`, `knip.json` and possibly a narrowed `turbo.json`; DCG-001 and DCG-002 |
| GitHub workflows | Change required | Quality, Preview, teardown, Production and receipt workflows; DCG-002 through DCG-004 |
| Workflow policies, fixtures and tests | Change required | `tools/quality-workflow/*` and `tools/docs-deployment/*`; DCG-001 through DCG-004 |
| Evidence and cache owners | Change required | Deployment evidence preparation, workflow contracts and automation register; DCG-003 and DCG-004 |
| Alchemy configuration | Preserve | `alchemy.run.ts` and existing typed deployment boundary consume the same named values; DCG-003 and DCG-004 prove no resource-graph change |
| App runtime, API, SDK, calculators and public packages | N/A | The change ends before application/public package behaviour; no imports, exports, schemas or public contract move |
| React routes, content, navigation and browser UI | N/A | No user-visible route or content behaviour changes; hosted checks retain existing journeys only |
| Package exports, generators, migrations and generated output | N/A | No package or data-model boundary changes |
| Repository skills, `AGENTS.md`, instruction links and agent metadata | N/A | Existing routes already require the named skills and authority model; no new reusable skill is created |
| Lint rules and accepted/rejected code fixtures | N/A | Workflow policies and deterministic tests own this source/config boundary; no TypeScript language rule changes |
| Changesets | N/A | Repository workflow, tool and maintainer-document changes do not alter installed package behaviour or exports |
| Historical evidence | Preserve | Existing receipts remain immutable and are not rewritten or promoted to the new credential epoch |

## Acceptance criteria

- Every governed command has one fixed, documented Doppler project/config and
  injects only named values with fallback and Bun env-file loading disabled.
- GitHub fetches through the immutable v2.0.0 action and scopes each output to
  its exact consumer after all cache saves.
- Fork Quality remains complete and credential-free.
- Preview and Production cannot select or receive each other's Doppler config,
  GitHub environment, Alchemy stage or provider credential.
- Existing Alchemy resource and proof contracts pass unchanged.
- Raw provider output is not uploaded; prepared artifacts and cache paths pass
  positive and negative secret tests.
- Bootstrap, failure, rotation, rollback and recovery are documented without
  recording values.
- Full repository verification passes using the pinned Bun version.
- Hosted/provider claims are made only after separately authorised exact-SHA
  runs and readback. Any unperformed operation remains named and bounded.
- The implementation is not package-facing, so no Changeset is added.

## References

- [Doppler CLI](https://docs.doppler.com/docs/cli)
- [Doppler service tokens](https://docs.doppler.com/docs/service-tokens)
- [Doppler automatic fallbacks](https://docs.doppler.com/docs/automatic-fallbacks)
- [Doppler service-account identities](https://docs.doppler.com/docs/service-account-identities)
- [Doppler GitHub OIDC examples](https://docs.doppler.com/docs/github-oidc-examples)
- [Doppler branch configs](https://docs.doppler.com/docs/branch-configs)
- [Doppler secrets-fetch action](https://github.com/DopplerHQ/secrets-fetch-action/tree/451892f16195f9ac360e1a5bcbf0b5fd0e957534)
- [Bun environment variables](https://bun.sh/docs/runtime/environment-variables)
- [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub dependency caching](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
- [GitHub OpenID Connect reference](https://docs.github.com/en/actions/reference/openid-connect-reference)
- [Alchemy state store](https://v2.alchemy.run/state-store)
- [Alchemy stages](https://v2.alchemy.run/environments/stages)
- [Cloudflare Workers external CI/CD](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions)
- [Cloudflare account-owned API tokens](https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/)
