---
name: package-structure
description: Scaffold, audit, migrate, or validate TypeScript packages with strict Effect v4 boundaries, explicit live-types exports, deterministic test Layers, and repository-local source conditions. Use for Effect service, RPC, or HTTP API packages; package export maps; live.layer.ts/test.layer.ts separation; package ownership; helper-sprawl prevention; or replacing stale package scaffolds. Do not use for repository-root or TanStack application scaffolding.
---

# Package Structure

Build the narrowest package that owns a real semantic boundary. Follow the
repository contract before the generic templates.

## Resolve the repository contract

1. Read the applicable `AGENTS.md`, root/package `README*`, architecture docs,
   manifests, TypeScript/lint/test config, and current package exemplars.
2. If invoked through a repository-local same-name skill, read its
   `references/repository-profile.md` first. That profile owns package manager,
   namespace, source condition, package exceptions, forbidden paths, and
   package commands.
3. Load the sibling [`docs-maintainer`](../docs-maintainer/SKILL.md) and its
   repository-local profile when present. That profile—not the package
   profile—owns documentation, runbook, proof, lifecycle, and archive routes.
4. Inspect the worktree before writes. Preserve unrelated changes and do not
   scaffold into a package until ownership is decided.
5. Load [package contract](references/package-contract.md), then only the
   relevant variant section in [variants](references/variants.md).

## Select the variant

- `effect-service`: domain/provider capability with Schemas, expected failures,
  a contract-only service, production Layer, and deterministic test Layer.
- `rpc`: RPC transport over an existing domain service. It owns RPC contracts,
  handlers, clients, and transport—not domain policy.
- `http-api`: HTTP transport over an existing domain service. It owns API
  groups, status mapping, handlers, browser/in-process clients, and routes.
- Source-only or publishable packages are export/build policies applied after
  choosing the semantic variant; they are not extra module trees.

Do not create a package for one-use code, a pass-through wrapper, a generic
`utils` bucket, or a boundary already owned by another package.

## Render or audit

For a new package, use the canonical renderer. It refuses existing targets and
has no overwrite mode. It renders the compiled-internal policy only; source-only
and publishable packages require a repository-specific audit/migration because
their bundler and actual publisher own the proof:

```bash
python3 scripts/render_package.py \
  --kind effect-service \
  --target /absolute/new/package \
  --package-name @scope/catalog \
  --source-condition @scope/source \
  --versions /absolute/version-snapshot.json
```

RPC and HTTP API also require `--domain-package @scope/catalog`. Read
[renderer and safety](references/renderer-and-safety.md) before invoking it.

For an existing package, run inspection first and make the smallest patch that
brings it to the owning repository contract:

```bash
python3 scripts/inspect_package.py /absolute/package
python3 scripts/validate_package.py /absolute/package
```

## Enforce the Effect boundary

- `schemas.ts` owns Schemas, brands, and schema-derived types.
- `errors.ts` owns expected failures. Serializable boundaries use
  `Schema.TaggedErrorClass`; internal-only failures may use `Data.TaggedError`.
- `service.ts` owns only `Context.Service` contracts—never a Layer or SDK.
- `live.layer.ts` keeps host/SDK construction private and owns production
  configuration/resources.
- `test.layer.ts` creates deterministic substitution at the same contract and
  may return `{ layer, observations }` scoped to one test.
- Decode unknown provider input/output once at ingress. Encode only at outward
  HTTP/RPC/provider/persistence/report boundaries.
- Keep operations lazy, flat, and sequential. Keep one-use mapping, decoding,
  and error handling beside the operation. Extract only demonstrated reuse,
  independently testable policy, real I/O, or resource lifetime.
- Reject generic SDK callbacks, raw client access, unbranded semantic strings,
  primitive semantic config, runtime type-class branching, unchecked output,
  scattered Effect execution, and speculative helpers.
- When a public schema/service/transport changes, update the repository's
  architecture owner and affected proof/critical journeys in the same slice.
  Operational packages route to a repository runbook; pure packages state why
  no runbook applies.

Read [Effect service rules](references/effect-service.md) before changing an
external client or live Layer.

## Validate and hand off

Run the repository's real format, lint, typecheck, focused tests, integration
tests, build, packed-artifact, and downstream commands that apply. Also run:

```bash
python3 scripts/validate_package.py /absolute/package
python3 scripts/validate_ecosystem.py /absolute/skill-or-repository-root
```

For publishable packages, inspect the tarball produced by the repository's
actual publisher; `publishConfig.exports` alone is not proof that npm or Bun
removed the development source condition.

For new or changed skill folders, run the global skill validator separately.
Run the local docs-maintainer checks and attach the applicable impact rows and
non-claims. Report the selected variant, ownership decision, exports,
documentation/proof impact, tests, commands, and any repository-specific exception. Render receipts
retain official sources, qualified compatibility decisions, config digests,
limitations, and non-claims. Read [maintenance](references/maintenance.md)
when updating templates, validators, or Effect APIs.
