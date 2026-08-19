const strictAppBoundaryPaths = [
  "apps/docs/src/lib/runtime-factory.server.ts",
  "apps/docs/src/lib/runtime.server.ts",
  "apps/docs/src/server.ts",
  "tools/docs-deployment/inventory-credentials.boundary.ts",
  "tools/docs-deployment/inventory.runtime.ts",
  "tools/docs-deployment/workflow-input-check.runtime.ts",
  "tools/docs-deployment/workflow-plan-check.runtime.ts",
  "tools/docs-deployment/workflow-proof-check.runtime.ts",
  "tools/docs-deployment/workflow-run-check.runtime.ts",
  "tools/docs-deployment/workflow-teardown-proof-check.runtime.ts",
] as const;

export type StrictAppBoundaryPath = (typeof strictAppBoundaryPaths)[number];
export type StrictAppBoundarySources = Readonly<
  Record<StrictAppBoundaryPath, string>
>;

export interface StrictAppBoundaryFinding {
  readonly invariant:
    | "credential-boundary"
    | "host-ingress"
    | "raw-concurrency"
    | "runtime-owner"
    | "runtime-probe"
    | "workflow-boundary";
  readonly path: StrictAppBoundaryPath;
}

const workflowRuntimePaths = strictAppBoundaryPaths.filter((path) =>
  path.includes("workflow-")
);

const finding = (
  invariant: StrictAppBoundaryFinding["invariant"],
  path: StrictAppBoundaryPath
): StrictAppBoundaryFinding => ({ invariant, path });

const includesAny = (source: string, values: readonly string[]): boolean =>
  values.some((value) => source.includes(value));

const includesEvery = (source: string, values: readonly string[]): boolean =>
  values.every((value) => source.includes(value));

const inspectGenericBoundaries = (
  sources: StrictAppBoundarySources
): StrictAppBoundaryFinding[] => {
  const findings: StrictAppBoundaryFinding[] = [];
  const hostIngressPatterns = [
    "process.env",
    "Bun.file",
    "JSON.parse",
    'from "node:fs',
    "from 'node:fs",
  ] as const;
  const runtimeExecutionPatterns = [
    "Effect.runPromise",
    "Effect.runSync",
  ] as const;
  const rawConcurrencyPatterns = [
    "Promise.all",
    'concurrency: "unbounded"',
  ] as const;

  for (const path of strictAppBoundaryPaths) {
    const source = sources[path];
    if (includesAny(source, hostIngressPatterns)) {
      findings.push(finding("host-ingress", path));
    }
    if (includesAny(source, runtimeExecutionPatterns)) {
      findings.push(finding("runtime-owner", path));
    }
    if (includesAny(source, rawConcurrencyPatterns)) {
      findings.push(finding("raw-concurrency", path));
    }
  }
  return findings;
};

const inspectWorkflowBoundaries = (
  sources: StrictAppBoundarySources
): StrictAppBoundaryFinding[] => {
  const findings: StrictAppBoundaryFinding[] = [];
  const requiredPatterns = [
    "Config.schema(",
    "readWorkflowReceipt(",
    "BunRuntime.runMain(program)",
  ] as const;

  for (const path of workflowRuntimePaths) {
    if (!includesEvery(sources[path], requiredPatterns)) {
      findings.push(finding("workflow-boundary", path));
    }
  }
  return findings;
};

const inspectCredentialBoundary = (
  sources: StrictAppBoundarySources
): readonly StrictAppBoundaryFinding[] => {
  const boundaryPath =
    "tools/docs-deployment/inventory-credentials.boundary.ts" as const;
  const credentialBoundary = sources[boundaryPath];
  const inventoryRuntime =
    sources["tools/docs-deployment/inventory.runtime.ts"];
  const boundaryRequirements = [
    "FileSystem.FileSystem",
    "Schema.fromJsonString(",
    'onExcessProperty: "error"',
  ] as const;
  const runtimeRequirements = [
    "Config.unwrap(",
    "readDocsDeploymentStateStoreCredentials(",
  ] as const;

  return includesEvery(credentialBoundary, boundaryRequirements) &&
    includesEvery(inventoryRuntime, runtimeRequirements)
    ? []
    : [finding("credential-boundary", boundaryPath)];
};

const inspectDocsRuntimeBoundary = (
  sources: StrictAppBoundarySources
): readonly StrictAppBoundaryFinding[] => {
  const factoryPath = "apps/docs/src/lib/runtime-factory.server.ts" as const;
  const runtimeFactory = sources[factoryPath];
  const runtimeComposition = sources["apps/docs/src/lib/runtime.server.ts"];
  const serverAdapter = sources["apps/docs/src/server.ts"];
  const forbiddenFactoryPatterns = [
    "globalThis.crypto",
    "randomUUID",
    "Math.random",
  ] as const;
  const factoryRequirements = ["Context.Service", "Ref.make("] as const;
  const adapterRequirements = [
    "docsRuntime.runPromise(",
    "readDocsRuntimeProbe",
    "Schema.encodeUnknownEffect(",
  ] as const;
  const valid =
    !/^let\s+/mu.test(runtimeFactory) &&
    !includesAny(runtimeFactory, forbiddenFactoryPatterns) &&
    includesEvery(runtimeFactory, factoryRequirements) &&
    runtimeComposition.includes("Random.nextIntBetween(") &&
    runtimeComposition.match(/makeDocsRuntime\(/gu)?.length === 1 &&
    runtimeComposition.match(/makeDocsRuntimeProbeLayer\(/gu)?.length === 1 &&
    includesEvery(serverAdapter, adapterRequirements);

  return valid ? [] : [finding("runtime-probe", factoryPath)];
};

export const inspectStrictAppBoundaries = (
  sources: StrictAppBoundarySources
): readonly StrictAppBoundaryFinding[] => [
  ...inspectGenericBoundaries(sources),
  ...inspectWorkflowBoundaries(sources),
  ...inspectCredentialBoundary(sources),
  ...inspectDocsRuntimeBoundary(sources),
];
