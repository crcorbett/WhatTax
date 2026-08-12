import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

import { inspectStrictAppBoundaries } from "./strict-boundaries.policy.js";
import type {
  StrictAppBoundaryPath,
  StrictAppBoundarySources,
} from "./strict-boundaries.policy.js";

const readSource = (path: StrictAppBoundaryPath) => readFile(path, "utf-8");

const readGovernedSources = async (): Promise<StrictAppBoundarySources> => ({
  "apps/docs/src/lib/runtime-factory.server.ts": await readSource(
    "apps/docs/src/lib/runtime-factory.server.ts"
  ),
  "apps/docs/src/lib/runtime.server.ts": await readSource(
    "apps/docs/src/lib/runtime.server.ts"
  ),
  "apps/docs/src/server.ts": await readSource("apps/docs/src/server.ts"),
  "tools/docs-deployment/inventory-credentials.boundary.ts": await readSource(
    "tools/docs-deployment/inventory-credentials.boundary.ts"
  ),
  "tools/docs-deployment/inventory.runtime.ts": await readSource(
    "tools/docs-deployment/inventory.runtime.ts"
  ),
  "tools/docs-deployment/orphan-inventory.process-boundary.ts":
    await readSource(
      "tools/docs-deployment/orphan-inventory.process-boundary.ts"
    ),
  "tools/docs-deployment/orphan-inventory.runtime.ts": await readSource(
    "tools/docs-deployment/orphan-inventory.runtime.ts"
  ),
  "tools/docs-deployment/orphan-inventory.service.ts": await readSource(
    "tools/docs-deployment/orphan-inventory.service.ts"
  ),
  "tools/docs-deployment/workflow-input-check.runtime.ts": await readSource(
    "tools/docs-deployment/workflow-input-check.runtime.ts"
  ),
  "tools/docs-deployment/workflow-plan-check.runtime.ts": await readSource(
    "tools/docs-deployment/workflow-plan-check.runtime.ts"
  ),
  "tools/docs-deployment/workflow-proof-check.runtime.ts": await readSource(
    "tools/docs-deployment/workflow-proof-check.runtime.ts"
  ),
  "tools/docs-deployment/workflow-run-check.runtime.ts": await readSource(
    "tools/docs-deployment/workflow-run-check.runtime.ts"
  ),
  "tools/docs-deployment/workflow-teardown-proof-check.runtime.ts":
    await readSource(
      "tools/docs-deployment/workflow-teardown-proof-check.runtime.ts"
    ),
});

const replaceSource = (
  sources: StrictAppBoundarySources,
  path: StrictAppBoundaryPath,
  mutate: (source: string) => string
): StrictAppBoundarySources => ({
  ...sources,
  [path]: mutate(sources[path]),
});

const findingInvariants = (sources: StrictAppBoundarySources) =>
  inspectStrictAppBoundaries(sources).map(({ invariant }) => invariant);

describe("strict docs app and deployment architecture", () => {
  test("accepts the exact governed Effect and host boundaries", async () => {
    const sources = await readGovernedSources();
    expect(inspectStrictAppBoundaries(sources)).toEqual([]);
  });

  test("rejects direct environment, manual JSON/file and raw runtime execution", async () => {
    const sources = await readGovernedSources();
    const path = "tools/docs-deployment/orphan-inventory.service.ts";
    const contaminated = replaceSource(sources, path, (source) =>
      [
        source,
        'const token = process.env["TOKEN"];',
        'const input = JSON.parse("{}");',
        'const file = Bun.file("receipt.json");',
        "Effect.runPromise(Effect.void);",
      ].join("\n")
    );
    expect(findingInvariants(contaminated)).toEqual(
      expect.arrayContaining(["host-ingress", "runtime-owner"])
    );
  });

  test("rejects raw concurrency and ambient child environment inheritance", async () => {
    const sources = await readGovernedSources();
    const path = "tools/docs-deployment/orphan-inventory.service.ts";
    const contaminated = replaceSource(
      sources,
      path,
      (source) =>
        `${source.replace("extendEnv: false", "extendEnv: true")}\nPromise.all([]);\n`
    );
    expect(findingInvariants(contaminated)).toEqual(
      expect.arrayContaining(["process-environment", "raw-concurrency"])
    );
  });

  test("rejects unmanaged docs runtime proof state and randomness", async () => {
    const sources = await readGovernedSources();
    const path = "apps/docs/src/lib/runtime-factory.server.ts";
    const contaminated = replaceSource(sources, path, (source) =>
      [
        "let runtimeConstructionCount = 0;",
        "const isolateId = globalThis.crypto.randomUUID();",
        source,
      ].join("\n")
    );
    expect(findingInvariants(contaminated)).toContain("runtime-probe");
  });

  test("rejects bypassed shared credential, workflow and process boundaries", async () => {
    const sources = await readGovernedSources();
    const withoutCredentialBoundary = replaceSource(
      sources,
      "tools/docs-deployment/inventory.runtime.ts",
      (source) =>
        source.replace(
          "readDocsDeploymentStateStoreCredentials(",
          "readUncheckedCredentials("
        )
    );
    const withoutWorkflowBoundary = replaceSource(
      sources,
      "tools/docs-deployment/workflow-input-check.runtime.ts",
      (source) => source.replace("readWorkflowReceipt(", "readReceipt(")
    );
    const withoutProcessBoundary = replaceSource(
      sources,
      "tools/docs-deployment/orphan-inventory.service.ts",
      (source) =>
        source.replace(
          "restoreDocsDeploymentJsonCommand(",
          "restoreUncheckedJson("
        )
    );

    expect(findingInvariants(withoutCredentialBoundary)).toContain(
      "credential-boundary"
    );
    expect(findingInvariants(withoutWorkflowBoundary)).toContain(
      "workflow-boundary"
    );
    expect(findingInvariants(withoutProcessBoundary)).toContain(
      "process-environment"
    );
  });

  test("permits the narrow byte adapter and Worker host callback", async () => {
    const sources = await readGovernedSources();
    expect(
      sources["tools/docs-deployment/orphan-inventory.process-boundary.ts"]
    ).toContain('new TextDecoder("utf-8", { fatal: true })');
    expect(sources["apps/docs/src/server.ts"]).toContain(
      "fetch: async (request: Request)"
    );
    expect(inspectStrictAppBoundaries(sources)).toEqual([]);
  });
});
