import { Effect, Schema } from "effect";

import type {
  DeploymentPlanProjection,
  LegacyMigrationDeploymentPlanProjection,
} from "./schemas.js";

export const alchemyPlanTextVersion = "2.0.0-beta.64" as const;

const ResourceAction = Schema.Literals(["create", "update", "noop", "delete"]);
const NativeResource = Schema.Struct({
  action: ResourceAction,
  logicalId: Schema.Literal("DocsWebsite"),
  resourceType: Schema.Literal("Cloudflare.Worker"),
});
type NativeResource = typeof NativeResource.Type;

type WorkflowPlanProjection =
  | DeploymentPlanProjection
  | LegacyMigrationDeploymentPlanProjection;

export const stringifyWorkflowPlanProjection = (
  projection: WorkflowPlanProjection
): string =>
  JSON.stringify({
    candidate: {
      deploymentInputSha256: projection.candidate.deploymentInputSha256,
      exactCommit: projection.candidate.exactCommit,
      lockfileSha256: projection.candidate.lockfileSha256,
    },
    configSha256: projection.configSha256,
    logicalResources: projection.logicalResources,
    redaction: projection.redaction,
    schemaVersion: projection.schemaVersion,
    stack: projection.stack,
    stage: projection.stage,
  });

export const WorkflowPlanProjectionKind = Schema.Literals([
  "deploy",
  "destroy",
  "migrate",
]);
export type WorkflowPlanProjectionKind = typeof WorkflowPlanProjectionKind.Type;

export class WorkflowPlanProjectionError extends Schema.TaggedErrorClass<WorkflowPlanProjectionError>()(
  "WorkflowPlanProjectionError",
  {
    reason: Schema.NonEmptyString,
  }
) {}

// oxlint-disable-next-line eslint/no-control-regex -- ANSI colour is an explicit Alchemy host-output boundary.
const ansiEscape = /\u001B\[[0-?]*[ -/]*[@-~]/gu;
const timestampLog = /^\[\d{2}:\d{2}:\d{2}(?:\.\d+)?\] [A-Z]+ /u;
const resourceLine = /^\[[^\]]+\] /u;
const nativeResourceLine = /^\[DocsWebsite\] (create|update|noop|delete)$/u;
const legacyMigrationResourceLine = /^\[DocsBuild\] delete$/u;
const legacyMigrationWebsiteLine = /^\[DocsWebsite\] (update|noop)$/u;

const fail = (reason: string) =>
  Effect.fail(new WorkflowPlanProjectionError({ reason }));

export const projectAlchemyPlanText = (
  source: string,
  kind: WorkflowPlanProjectionKind
) =>
  Effect.gen(function* () {
    const resourceLines = source
      .replace(ansiEscape, "")
      .split(/\r?\n/u)
      .filter((line) => resourceLine.test(line))
      .filter((line) => !timestampLog.test(line));
    if (kind === "migrate") {
      const websiteLine = resourceLines.find((line) =>
        legacyMigrationWebsiteLine.test(line)
      );
      if (
        resourceLines.length !== 2 ||
        !resourceLines.some((line) => legacyMigrationResourceLine.test(line)) ||
        websiteLine === undefined
      ) {
        return yield* fail(
          "a legacy migration plan must contain exactly DocsBuild delete and DocsWebsite update or noop"
        );
      }
      return [
        {
          action: "delete" as const,
          logicalId: "DocsBuild" as const,
          resourceType: "Command.Build" as const,
        },
        {
          action: websiteLine === "[DocsWebsite] update" ? "update" : "noop",
          logicalId: "DocsWebsite" as const,
          resourceType: "Cloudflare.Worker" as const,
        },
      ];
    }
    const unexpected = resourceLines.filter(
      (line) => !nativeResourceLine.test(line)
    );
    if (unexpected.length > 0) {
      return yield* fail(
        `unsupported beta.64 Alchemy plan resource line: ${unexpected[0]}`
      );
    }

    const resources = yield* Effect.all(
      resourceLines.map((line) =>
        Schema.decodeUnknownEffect(ResourceAction)(
          line.slice("[DocsWebsite] ".length)
        ).pipe(
          Effect.mapError(
            () =>
              new WorkflowPlanProjectionError({
                reason: "unsupported native Alchemy plan action",
              })
          ),
          Effect.map(
            (action): NativeResource => ({
              action,
              logicalId: "DocsWebsite",
              resourceType: "Cloudflare.Worker",
            })
          )
        )
      )
    );
    if (kind === "deploy" && resources.length !== 1) {
      return yield* fail(
        "a native deployment plan must contain exactly one DocsWebsite action"
      );
    }
    if (
      kind === "deploy" &&
      resources[0] !== undefined &&
      resources[0].action === "delete"
    ) {
      return yield* fail(
        "a native deployment plan cannot delete the DocsWebsite resource"
      );
    }
    if (kind === "destroy" && resources.length > 1) {
      return yield* fail(
        "a native teardown plan must contain at most one DocsWebsite action"
      );
    }
    if (
      kind === "destroy" &&
      resources[0] !== undefined &&
      resources[0].action !== "delete" &&
      resources[0].action !== "noop"
    ) {
      return yield* fail(
        "a native teardown plan may only delete or noop the DocsWebsite resource"
      );
    }

    return resources.length === 0
      ? [
          {
            action: "noop" as const,
            logicalId: "DocsWebsite" as const,
            resourceType: "Cloudflare.Worker" as const,
          },
        ]
      : resources;
  });
