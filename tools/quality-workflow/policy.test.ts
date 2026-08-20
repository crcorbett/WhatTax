import { describe, expect, test } from "bun:test";

import { Effect, Schema } from "effect";

import automationJson from "./automation-register.json";
import controlsJson from "./controls.json";
import {
  decodeQualityWorkflow,
  inspectGovernanceRegisters,
  inspectQualityWorkflow,
  inspectReleaseRuntime,
} from "./policy.js";
import { AutomationRegister, ControlRegister } from "./schemas.js";

const acceptedWorkflow = `name: Quality
on:
  pull_request:
  push:
    branches:
      - main
permissions:
  contents: read
env:
  PLAYWRIGHT_BROWSERS_PATH: ${"${{"} github.workspace }}/../.cache/ms-playwright
  TAXKIT_ACTION_PIN_UPDATE_OWNER: taxkit-ci-release-maintainer
  TURBO_CACHE: ${"${{"} github.event_name == 'pull_request' && 'local:rw,remote:r' || 'local:rw,remote:rw' }}
  TURBO_TEAM: ${"${{"} vars.TURBO_TEAM }}
  TURBO_TOKEN: ${"${{"} secrets.TURBO_TOKEN }}
concurrency:
  group: quality-${"${{"} github.workflow }}-${"${{"} github.ref }}
  cancel-in-progress: true
jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5
        with:
          fetch-depth: 0
      - run: git show-ref --verify --quiet refs/heads/main || git branch --track main origin/main
      - uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6
        with:
          bun-version-file: .bun-version
      - id: bun-cache-path
        run: echo "path=$(bun pm cache)" >> "$GITHUB_OUTPUT"
      - id: bun-cache-restore
        uses: actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9
        continue-on-error: true
        with:
          path: ${"${{"} steps.bun-cache-path.outputs.path }}
          key: bun-packages-${"${{"} github.event_name }}-${"${{"} runner.os }}-${"${{"} runner.arch }}-${"${{"} hashFiles('.bun-version') }}-${"${{"} hashFiles('bun.lock') }}
      - run: bun install --frozen-lockfile
      - uses: actions/cache/save@55cc8345863c7cc4c66a329aec7e433d2d1c52a9
        if: steps.bun-cache-restore.outputs.cache-hit != 'true'
        continue-on-error: true
        with:
          path: ${"${{"} steps.bun-cache-path.outputs.path }}
          key: ${"${{"} steps.bun-cache-restore.outputs.cache-primary-key }}
      - id: playwright-identity
        run: echo "version=$(apps/docs/node_modules/.bin/playwright --version | cut -d' ' -f2)" >> "$GITHUB_OUTPUT"
      - id: playwright-cache-restore
        uses: actions/cache/restore@55cc8345863c7cc4c66a329aec7e433d2d1c52a9
        continue-on-error: true
        with:
          path: ${"${{"} env.PLAYWRIGHT_BROWSERS_PATH }}
          key: playwright-chromium-${"${{"} github.event_name }}-${"${{"} runner.os }}-${"${{"} runner.arch }}-${"${{"} steps.playwright-identity.outputs.version }}-${"${{"} hashFiles('bun.lock') }}
      - run: apps/docs/node_modules/.bin/playwright install --with-deps chromium
      - uses: actions/cache/save@55cc8345863c7cc4c66a329aec7e433d2d1c52a9
        if: steps.playwright-cache-restore.outputs.cache-hit != 'true'
        continue-on-error: true
        with:
          path: ${"${{"} env.PLAYWRIGHT_BROWSERS_PATH }}
          key: ${"${{"} steps.playwright-cache-restore.outputs.cache-primary-key }}
      - run: bun run check:quality-workflow
      - run: bun run release:check -- --ci
`;

const findingsFor = (text: string) =>
  inspectQualityWorkflow(Effect.runSync(decodeQualityWorkflow(text)));

describe("quality workflow policy", () => {
  test("accepts the decoded bounded read-only canonical release graph", () => {
    expect(findingsFor(acceptedWorkflow)).toEqual([]);
  });

  test("rejects shallow or ambiguous release-history setup", () => {
    for (const workflow of [
      acceptedWorkflow.replace("fetch-depth: 0", "fetch-depth: 1"),
      acceptedWorkflow.replace(
        "git show-ref --verify --quiet refs/heads/main || git branch --track main origin/main",
        "git fetch origin main"
      ),
    ]) {
      expect(findingsFor(workflow).map((item) => item.invariant)).toContain(
        "workflow-mutation-step"
      );
    }
  });

  test("rejects a changed or omitted browser bootstrap command", () => {
    for (const workflow of [
      acceptedWorkflow.replace(
        "apps/docs/node_modules/.bin/playwright install --with-deps chromium",
        "bunx playwright install --with-deps chromium"
      ),
      acceptedWorkflow.replace(
        "      - run: apps/docs/node_modules/.bin/playwright install --with-deps chromium\n",
        ""
      ),
    ]) {
      expect(findingsFor(workflow).map((item) => item.invariant)).toContain(
        "workflow-mutation-step"
      );
    }
  });

  test("rejects node_modules caches and keys without event or version identity", () => {
    for (const workflow of [
      acceptedWorkflow.replace(
        ["path: $", "{{ steps.bun-cache-path.outputs.path }}"].join(""),
        "path: node_modules"
      ),
      acceptedWorkflow.replace("bun-packages-${", "bun-packages-"),
      acceptedWorkflow.replace(
        ["-$", "{{ hashFiles('.bun-version') }}"].join(""),
        ""
      ),
      acceptedWorkflow.replace(
        ["-$", "{{ steps.playwright-identity.outputs.version }}"].join(""),
        ""
      ),
    ]) {
      expect(findingsFor(workflow).map((item) => item.invariant)).toContain(
        "workflow-mutation-step"
      );
    }
  });

  test("rejects trusted-key reuse, cache failures that stop Quality and early saves", () => {
    for (const workflow of [
      acceptedWorkflow.replace(
        ["$", "{{ github.event_name }}"].join(""),
        "push"
      ),
      acceptedWorkflow.replace("        continue-on-error: true\n", ""),
      acceptedWorkflow.replace(
        "      - run: bun install --frozen-lockfile\n      - uses: actions/cache/save@",
        "      - uses: actions/cache/save@"
      ),
      acceptedWorkflow.replace(
        "      - run: apps/docs/node_modules/.bin/playwright install --with-deps chromium\n      - uses: actions/cache/save@",
        "      - uses: actions/cache/save@"
      ),
    ]) {
      expect(findingsFor(workflow).map((item) => item.invariant)).toContain(
        "workflow-mutation-step"
      );
    }
  });

  test("rejects a floating action, authority expansion and bypassed graph in the actual job", () => {
    expect(
      findingsFor(
        acceptedWorkflow
          .replace("contents: read", "contents: write")
          .replace("@34e114876b0b11c390a56381ad16ebd13914f8d5", "@v4")
          .replace("bun run release:check -- --ci", "bun run verification")
      ).map((item) => item.invariant)
    ).toEqual([
      "canonical-release-graph",
      "workflow-action-pin",
      "workflow-mutation-step",
      "workflow-permissions",
    ]);
  });

  test("rejects comment and other-job spoofing instead of scanning text", () => {
    expect(
      findingsFor(
        acceptedWorkflow
          .replace(
            "      - run: bun run release:check -- --ci",
            "      - run: bun run verification # bun run release:check -- --ci"
          )
          .replace(
            "jobs:\n  quality:",
            "jobs:\n  spoof:\n    runs-on: ubuntu-latest\n    timeout-minutes: 30\n    steps:\n      - run: bun run release:check -- --ci\n  quality:"
          )
      ).map((item) => item.invariant)
    ).toContain("canonical-release-graph");
  });

  test("rejects malformed YAML and all path-filter variants", () => {
    expect(() => Effect.runSync(decodeQualityWorkflow("jobs: ["))).toThrow();
    for (const filter of [
      "    paths:\n      - packages/**\n",
      "    paths-ignore:\n      - docs/**\n",
    ]) {
      expect(
        findingsFor(
          acceptedWorkflow.replace(
            "    branches:\n",
            `${filter}    branches:\n`
          )
        ).map((item) => item.invariant)
      ).toContain("workflow-triggers");
    }
  });

  test("rejects branch pushes that duplicate pull-request coverage", () => {
    expect(
      findingsFor(
        acceptedWorkflow.replace(
          "    branches:\n      - main\n",
          '    branches:\n      - main\n      - "codex/**"\n'
        )
      ).map((item) => item.invariant)
    ).toContain("workflow-triggers");
  });

  test("rejects missing action owner, timeout and cancellation semantics", () => {
    expect(
      findingsFor(
        acceptedWorkflow
          .replace("taxkit-ci-release-maintainer", "unowned")
          .replace("timeout-minutes: 30", "timeout-minutes: 120")
          .replace("cancel-in-progress: true", "cancel-in-progress: false")
      ).map((item) => item.invariant)
    ).toEqual([
      "workflow-concurrency",
      "workflow-pin-update-owner",
      "workflow-timeout",
    ]);
  });

  test("rejects missing cache identity, pull-request writes and step overrides", () => {
    for (const workflow of [
      acceptedWorkflow.replace(
        ["  TURBO_TEAM: $", "{{ vars.TURBO_TEAM }}\n"].join(""),
        ""
      ),
      acceptedWorkflow.replace(
        ["  TURBO_TOKEN: $", "{{ secrets.TURBO_TOKEN }}\n"].join(""),
        ""
      ),
      acceptedWorkflow.replace(
        "github.event_name == 'pull_request' && 'local:rw,remote:r'",
        "github.event_name == 'pull_request' && 'local:rw,remote:rw'"
      ),
      acceptedWorkflow.replace(
        "      - run: bun run release:check -- --ci",
        "      - run: bun run release:check -- --ci\n        env:\n          TURBO_CACHE: local:rw,remote:rw"
      ),
    ]) {
      expect(findingsFor(workflow).map((item) => item.invariant)).toContain(
        "workflow-cache-policy"
      );
    }
  });

  test("rejects every job-level permission override including equivalent write scopes", () => {
    for (const permissions of [
      "    permissions: write-all\n",
      "    permissions:\n      contents: write\n",
      "    permissions:\n      actions: write\n      contents: read\n",
    ]) {
      const findings = findingsFor(
        acceptedWorkflow.replace(
          "    runs-on: ubuntu-latest\n",
          `    runs-on: ubuntu-latest\n${permissions}`
        )
      );
      expect(findings.map((item) => item.target)).toContain(
        ".github/workflows/quality.yml:jobs.quality.permissions"
      );
    }
  });

  test("rejects job and release-step failure tolerance or execution skipping", () => {
    for (const contaminated of [
      acceptedWorkflow.replace(
        "    runs-on: ubuntu-latest\n",
        "    runs-on: ubuntu-latest\n    continue-on-error: true\n"
      ),
      acceptedWorkflow.replace(
        "      - run: bun run release:check -- --ci",
        "      - run: bun run release:check -- --ci\n        if: false"
      ),
      acceptedWorkflow.replace(
        "      - run: bun run release:check -- --ci",
        "      - run: bun run release:check -- --ci\n        continue-on-error: true"
      ),
    ]) {
      expect(findingsFor(contaminated).length).toBeGreaterThan(0);
    }
  });

  test("semantically rejects unsafe but schema-valid governance registers", () => {
    const controls = Effect.runSync(
      Schema.decodeUnknownEffect(ControlRegister)(controlsJson)
    );
    const automations = Effect.runSync(
      Schema.decodeUnknownEffect(AutomationRegister)(automationJson)
    );
    expect(inspectGovernanceRegisters(controls, automations)).toEqual([]);

    const unsafeControls = controls.map((control) =>
      control.id === "canonical-release-graph"
        ? { ...control, evidence: "bun run test" }
        : control
    );
    const unsafeAutomations = automations.map((automation) =>
      automation.id === "documentation-context-freshness" &&
      automation.candidate !== undefined
        ? {
            ...automation,
            candidate: {
              ...automation.candidate,
              candidatePath: "docs/README.md",
              publisher: automation.candidate.responsibleReviewer,
              selfFeedbackExclusions: ["unrelated input"],
            },
          }
        : automation
    );
    expect(
      inspectGovernanceRegisters(unsafeControls, unsafeAutomations).map(
        (item) => item.invariant
      )
    ).toEqual(["control-register", "automation-register"]);

    expect(
      inspectGovernanceRegisters(
        [...controls, { ...controls[0], id: "extra-control" }],
        automations
      ).map((item) => item.invariant)
    ).toContain("control-register");

    const unsafeControlContract = controls.map((control) => ({
      ...control,
      preventedFailure: "x",
      recovery: "x",
      retirementCondition: "x",
      reviewTrigger: "x",
      signal: "x",
    }));
    expect(
      inspectGovernanceRegisters(unsafeControlContract, automations).map(
        (item) => item.invariant
      )
    ).toContain("control-register");

    const longNonsense =
      "This sentence is deliberately long but carries no governance meaning whatsoever.";
    const meaningless = automations.map((automation) => ({
      ...automation,
      authority: { ...automation.authority, principal: longNonsense },
      proof: { ...automation.proof, command: longNonsense },
      recovery: { ...automation.recovery, action: longNonsense },
      resource: { ...automation.resource, scope: [longNonsense] },
      retirementCondition: {
        ...automation.retirementCondition,
        condition: longNonsense,
      },
      rollback: { ...automation.rollback, action: longNonsense },
      stopAndEscalation: {
        ...automation.stopAndEscalation,
        stopConditions: [longNonsense],
      },
    }));
    expect(
      inspectGovernanceRegisters(controls, meaningless).filter(
        (item) => item.invariant === "automation-register"
      ).length
    ).toBeGreaterThanOrEqual(2);
  });

  test("rejects aliased and parenthesized candidate reads in the CI branch", () => {
    const accepted = `import { Console } from "effect";
    import { runCiReleaseReadiness } from "./program.js";
    import { makeReleaseReadinessPlan } from "./schemas.js";
    const program = Effect.gen(function* main() {
      const cli = yield* decodeReleaseReadinessCli(args);
      if (cli.mode === "ci") {
        const report = yield* runCiReleaseReadiness(makeReleaseReadinessPlan(root));
        yield* Console.info("CI release graph passed");
        return report;
      }
      return yield* readReleaseEvidence(root);
    });`;
    expect(inspectReleaseRuntime(accepted)).toEqual([]);
    for (const contaminated of [
      accepted.replace(
        "const report =",
        "const read = readReleaseEvidence; yield* read(root); const report ="
      ),
      accepted.replace(
        "const report =",
        "yield* (readReleaseEvidence)(root); const report ="
      ),
      accepted.replace(
        "const report =",
        "yield* evidenceBoundary.readReleaseEvidence(root); const report ="
      ),
      accepted.replace(
        "const report =",
        "yield* ({ readReleaseEvidence }).readReleaseEvidence(root); const report ="
      ),
    ]) {
      expect(
        inspectReleaseRuntime(contaminated).map((item) => item.invariant)
      ).toEqual(["release-runtime-boundary"]);
    }
  });
});
