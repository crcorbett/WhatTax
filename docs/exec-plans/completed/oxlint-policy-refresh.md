---
document_type: execution-plan
lifecycle: historical
authority: supporting
owner: taxkit-tooling-owner
last_reviewed: 2026-08-31
review_trigger: OLP task transition, lint finding, dependency decision, verification result, or closeout
successor: null
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

## Closeout

The implementation candidate
`48384d5da44c25894612c7253003adc677f601dd` passed a frozen install, the full
test suite, the root verification graph, Changeset status and
`git diff --check`. Hosted pull-request Quality run `33375644482` then passed
on that exact candidate.

[Pull request #76](https://github.com/crcorbett/taxkit/pull/76) merged the
candidate as `1a0b180326bb93eecee373c57503880b44754506` on 2026-08-31. A fresh
fetch confirmed that exact merge as `origin/main`, and main Quality run
`33376169245` passed on that merge. The change installed the applicable generic
and Effect anti-slop rules, kept TaxKit's stricter local rules, fixed owned
findings structurally, and added a Changeset for the public contract
corrections. It did not publish a package, deploy an application, change
provider state or use credentials.

## Limits and recovery

This plan authorises repository edits and Git pull-request delivery only. It
does not authorise package publication, deployment, credentials or provider
changes. Recovery is a revert of the candidate repository commit.
