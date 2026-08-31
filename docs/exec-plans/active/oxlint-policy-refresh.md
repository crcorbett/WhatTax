---
document_type: execution-plan
lifecycle: current
authority: supporting
owner: taxkit-tooling-owner
last_reviewed: 2026-08-31
review_trigger: OLP task transition, lint finding, dependency decision, verification result, or closeout
successor: ../../product-specs/oxlint-policy-refresh.md
tombstone: false
---

# Oxlint Policy Refresh Execution Plan

Spec: [Oxlint Policy Refresh](../../product-specs/oxlint-policy-refresh.md)

Task list:
[`oxlint-policy-refresh.tasks.json`](../../product-specs/oxlint-policy-refresh.tasks.json)

## Evidence baseline

- The starting TaxKit revision is clean and matches the fetched default branch.
- The unchanged root lint gate passes with zero warnings and errors after a
  frozen-lockfile dependency install.
- The current compatible Oxlint and plugin runtime is 1.80.0.
- The applicable missing policy is the 15-rule generic anti-slop set, the
  Effect constructor-import rule, TypeScript redeclaration correction and
  module-level mutable-test-state rule.
- TaxKit already has stricter project-owned calculator, decoding,
  route-transport, Effect runtime, Bun host and MDX rules. These remain owned
  and enabled.

## Delivery order

1. Vendor the anti-slop plugin with the approved installer and update matched
   dependencies and narrow ignores.
2. Add the applicable shared config and portable Effect rule with focused
   real-binary fixtures.
3. Run lint, fix genuine owned findings, and update the durable tooling,
   ownership and quality documents.
4. Run the full local proof graph, review the diff, commit, open a pull request,
   wait for hosted Quality, merge and confirm the default-branch identity.

## Limits and recovery

This plan authorises repository edits and Git pull-request delivery only. It
does not authorise package publication, deployment, credentials or provider
changes. Recovery is a revert of the candidate repository commit.
