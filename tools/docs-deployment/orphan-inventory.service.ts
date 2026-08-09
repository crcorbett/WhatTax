import { Context, Effect, Layer, Schema, Stream } from "effect";
import type * as Scope from "effect/Scope";
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process";

import type { DocsDeploymentInventoryReport } from "./inventory.schemas.js";
import { DocsDeploymentInventoryReport as InventoryReportSchema } from "./inventory.schemas.js";
import type {
  DocsDeploymentOrphanInventoryReceipt,
  GitHubOpenPullRequest,
} from "./orphan-inventory.schemas.js";
import {
  docsDeploymentOpenPullRequestsCommand,
  docsDeploymentStateProviderInventoryCommand,
  DocsDeploymentOrphanInventoryInputError,
  DocsDeploymentOrphanInventoryReadError,
  GitHubOpenPullRequest as OpenPullRequestSchema,
} from "./orphan-inventory.schemas.js";

const repository = "crcorbett/taxkit" as const;
const githubPullRequestResultLimit = 1000;
const githubArgs = [
  "pr",
  "list",
  "--repo",
  repository,
  "--state",
  "open",
  "--limit",
  "1000",
  "--json",
  "headRefOid,isCrossRepository,isDraft,number,state,url",
] as const;

const previewStageNumber = (stage: string): number =>
  Number.parseInt(stage.slice("pr-".length), 10);

const decodeProcessBytes = (bytes: readonly Uint8Array[]) =>
  new TextDecoder().decode(
    Uint8Array.from(bytes.flatMap((chunk) => [...chunk]))
  );

export const makeDocsDeploymentOrphanInventoryReceipt = (
  observedAt: string,
  openPullRequests: readonly GitHubOpenPullRequest[],
  deploymentInventory: DocsDeploymentInventoryReport
): DocsDeploymentOrphanInventoryReceipt => {
  const previewStages = deploymentInventory.stages
    .filter((entry) => entry.stage !== "prod")
    .map((entry) => {
      const prNumber = previewStageNumber(entry.stage);
      const pullRequest =
        openPullRequests.find((candidate) => candidate.number === prNumber) ??
        null;
      let classification:
        | "active-trusted-preview"
        | "untrusted-preview-stage"
        | "orphan-candidate" = "active-trusted-preview";
      if (pullRequest === null) {
        classification = "orphan-candidate";
      } else if (
        pullRequest.isCrossRepository ||
        pullRequest.isDraft === false
      ) {
        classification = "untrusted-preview-stage";
      }
      return {
        classification,
        prNumber,
        pullRequest,
        stage: entry.stage,
        workerNames: entry.resources.flatMap((resource) =>
          resource.logicalId === "DocsWebsite" &&
          resource.workerName !== undefined
            ? [resource.workerName]
            : []
        ),
      };
    })
    .toSorted((left, right) => left.prNumber - right.prNumber);
  const previewStageNumbers = new Set(
    previewStages.map((entry) => entry.prNumber)
  );
  const trustedPullRequestsWithoutStage = openPullRequests
    .filter(
      (pullRequest) =>
        !pullRequest.isCrossRepository &&
        !previewStageNumbers.has(pullRequest.number)
    )
    .toSorted((left, right) => left.number - right.number);
  return {
    automaticDeletion: "prohibited",
    mutationCapability: "none",
    nonClaims: [
      "An orphan candidate is report-only and is not deletion authority or proof that a resource should be destroyed.",
      "This dated read does not establish hosted behavior, future provider state, deployment, teardown, DNS, release or publication.",
    ],
    observedAt,
    previewStages,
    repository,
    schemaVersion: 1,
    sources: {
      deploymentInventory: {
        command: docsDeploymentStateProviderInventoryCommand,
        report: deploymentInventory,
      },
      github: {
        command: docsDeploymentOpenPullRequestsCommand,
        openPullRequests,
      },
    },
    trustedPullRequestsWithoutStage,
  };
};

export const inspectDocsDeploymentOrphanInventoryReceipt = (
  receipt: DocsDeploymentOrphanInventoryReceipt
): readonly string[] => {
  const expected = makeDocsDeploymentOrphanInventoryReceipt(
    receipt.observedAt,
    receipt.sources.github.openPullRequests,
    receipt.sources.deploymentInventory.report
  );
  return JSON.stringify(receipt.previewStages) ===
    JSON.stringify(expected.previewStages) &&
    JSON.stringify(receipt.trustedPullRequestsWithoutStage) ===
      JSON.stringify(expected.trustedPullRequestsWithoutStage)
    ? []
    : [
        "orphan-inventory-classification: open pull requests, Alchemy stages and Cloudflare Workers must produce the exact report-only classification",
      ];
};

export interface DocsDeploymentOrphanSourcesShape {
  readonly readDeploymentInventory: (
    repositoryRoot: string
  ) => Effect.Effect<
    DocsDeploymentInventoryReport,
    | DocsDeploymentOrphanInventoryInputError
    | DocsDeploymentOrphanInventoryReadError,
    Scope.Scope
  >;
  readonly readOpenPullRequests: (
    repositoryRoot: string
  ) => Effect.Effect<
    readonly GitHubOpenPullRequest[],
    | DocsDeploymentOrphanInventoryInputError
    | DocsDeploymentOrphanInventoryReadError,
    Scope.Scope
  >;
}

export class DocsDeploymentOrphanSources extends Context.Service<
  DocsDeploymentOrphanSources,
  DocsDeploymentOrphanSourcesShape
>()("taxkit/DocsDeploymentOrphanSources") {}

export const DocsDeploymentOrphanSourcesLive = Layer.effect(
  DocsDeploymentOrphanSources,
  Effect.gen(function* makeDocsDeploymentOrphanSourcesLive() {
    const childProcesses = yield* ChildProcessSpawner.ChildProcessSpawner;

    const readJsonCommand = <A>(
      repositoryRoot: string,
      command: string,
      args: readonly string[],
      expectedCommand: string,
      operation: string,
      schema: Schema.ConstraintDecoder<A>
    ): Effect.Effect<
      A,
      | DocsDeploymentOrphanInventoryInputError
      | DocsDeploymentOrphanInventoryReadError,
      Scope.Scope
    > =>
      // oxlint-disable-next-line eslint/complexity -- one bounded process ingress keeps command identity and safe failure decoding together
      Effect.gen(function* readJsonCommandOutput() {
        if ([command, ...args].join(" ") !== expectedCommand) {
          return yield* new DocsDeploymentOrphanInventoryInputError({
            target: `${operation}:command-identity`,
          });
        }
        const handle = yield* childProcesses
          .spawn(
            ChildProcess.make(command, args, {
              cwd: repositoryRoot,
              env: {
                ALCHEMY_PROFILE: process.env["ALCHEMY_PROFILE"],
                HOME: process.env["HOME"],
              },
              extendEnv: true,
              forceKillAfter: "2 seconds",
              stderr: "pipe",
              stdin: "ignore",
              stdout: "pipe",
            })
          )
          .pipe(
            Effect.mapError(
              () => new DocsDeploymentOrphanInventoryReadError({ operation })
            )
          );
        const [stdout, stderr] = yield* Effect.all(
          [Stream.runCollect(handle.stdout), Stream.runCollect(handle.stderr)],
          { concurrency: "unbounded" }
        );
        const exitCode = yield* handle.exitCode;
        const stdoutText = decodeProcessBytes([...stdout]);
        const stderrText = decodeProcessBytes([...stderr]);
        const outputText = `${stdoutText}\n${stderrText}`;
        if (Number(exitCode) !== 0) {
          const cacheShape = outputText.match(
            /FAIL \[inventory-input\] target=missing cached Cloudflare state-store credentials fileVisible=(true|false) fileJsonObject=(true|false)/u
          );
          const safeFailure = outputText.match(
            /FAIL \[(inventory-input|inventory-read|inventory-disagreement)\](?: operation=([A-Za-z0-9:_-]+)| target=(CI=1|missing cached Cloudflare state-store credentials|invalid cached Cloudflare state-store credentials|cached state-store account identity))?/u
          );
          let inputSuffix: string | undefined;
          if (safeFailure?.[3] === "CI=1") {
            inputSuffix = "ci";
          } else if (
            safeFailure?.[3] === "cached state-store account identity"
          ) {
            inputSuffix = "account";
          } else if (
            safeFailure?.[3] ===
            "missing cached Cloudflare state-store credentials"
          ) {
            inputSuffix = "missing-cache";
          } else if (
            safeFailure?.[3] ===
            "invalid cached Cloudflare state-store credentials"
          ) {
            inputSuffix = "invalid-cache";
          } else if (safeFailure?.[3] !== undefined) {
            inputSuffix = "credentials";
          }
          const failureSuffix =
            safeFailure?.[2] ??
            inputSuffix ??
            safeFailure?.[1]?.replace("inventory-", "");
          const cacheShapeSuffix = cacheShape
            ? `-file-visible-${cacheShape[1]}-json-object-${cacheShape[2]}`
            : "";
          return yield* new DocsDeploymentOrphanInventoryReadError({
            operation: failureSuffix
              ? `${operation}:${failureSuffix}${cacheShapeSuffix}`
              : operation,
          });
        }
        const text = yield* Effect.try({
          catch: () =>
            new DocsDeploymentOrphanInventoryInputError({
              target: `${operation}:utf8`,
            }),
          try: () =>
            new TextDecoder("utf-8", { fatal: true }).decode(
              new TextEncoder().encode(stdoutText)
            ),
        });
        const decoded = yield* Schema.decodeUnknownEffect(
          Schema.fromJsonString(schema),
          {
            onExcessProperty: "error",
          }
        )(text).pipe(
          Effect.mapError(
            () =>
              new DocsDeploymentOrphanInventoryInputError({
                target: `${operation}:json`,
              })
          )
        );
        if (
          operation === "github-open-pull-requests" &&
          Array.isArray(decoded) &&
          decoded.length >= githubPullRequestResultLimit
        ) {
          return yield* new DocsDeploymentOrphanInventoryInputError({
            target: "incomplete GitHub pull-request inventory",
          });
        }
        return decoded;
      }).pipe(
        Effect.catchTag(
          "PlatformError",
          () => new DocsDeploymentOrphanInventoryReadError({ operation })
        )
      );

    return DocsDeploymentOrphanSources.of({
      readDeploymentInventory: (repositoryRoot) =>
        readJsonCommand(
          repositoryRoot,
          "bun",
          ["run", "check:docs-deployment-inventory"],
          docsDeploymentStateProviderInventoryCommand,
          "deployment-inventory",
          InventoryReportSchema
        ),
      readOpenPullRequests: (repositoryRoot) =>
        readJsonCommand(
          repositoryRoot,
          "gh",
          githubArgs,
          docsDeploymentOpenPullRequestsCommand,
          "github-open-pull-requests",
          Schema.Array(OpenPullRequestSchema)
        ),
    });
  })
);
