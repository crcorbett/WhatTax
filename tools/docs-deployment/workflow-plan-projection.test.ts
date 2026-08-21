import { describe, expect, test } from "bun:test";

import { Effect, Schema } from "effect";

import { DeploymentPlanProjection } from "./schemas.js";
import {
  alchemyPlanTextVersion,
  projectAlchemyPlanText,
  stringifyWorkflowPlanProjection,
} from "./workflow-plan-projection.js";

const project = (source: string, kind: "deploy" | "destroy" | "migrate") =>
  Effect.runPromise(projectAlchemyPlanText(source, kind));

describe("beta.64 Alchemy plan projection", () => {
  test("binds the parser to the installed Alchemy version", () => {
    expect(alchemyPlanTextVersion).toBe("2.0.0-beta.64");
  });

  test("keeps the projection digest in the receipt checker order", async () => {
    const [resource] = await project("[DocsWebsite] create\n", "deploy");
    const projection = Schema.decodeUnknownSync(DeploymentPlanProjection)({
      candidate: {
        deploymentInputSha256: "a".repeat(64),
        exactCommit: "b".repeat(40),
        lockfileSha256: "c".repeat(64),
      },
      configSha256: "d".repeat(64),
      logicalResources: [resource],
      redaction: {
        ansiRemoved: true,
        secretValuesIncluded: false,
        timestampsExcludedFromDigest: true,
      },
      schemaVersion: 2,
      stack: "TaxKitDocsCloudflare",
      stage: "prod",
    });
    expect(stringifyWorkflowPlanProjection(projection)).toBe(
      JSON.stringify({
        candidate: {
          deploymentInputSha256: "a".repeat(64),
          exactCommit: "b".repeat(40),
          lockfileSha256: "c".repeat(64),
        },
        configSha256: "d".repeat(64),
        logicalResources: [resource],
        redaction: {
          ansiRemoved: true,
          secretValuesIncluded: false,
          timestampsExcludedFromDigest: true,
        },
        schemaVersion: 2,
        stack: "TaxKitDocsCloudflare",
        stage: "prod",
      })
    );
  });

  test("accepts the native deployment actions", async () => {
    for (const action of ["create", "update", "noop"] as const) {
      await expect(
        project(`[DocsWebsite] ${action}\n`, "deploy")
      ).resolves.toEqual([
        { action, logicalId: "DocsWebsite", resourceType: "Cloudflare.Worker" },
      ]);
    }
  });

  test("accepts native teardown delete and no-op output", async () => {
    await expect(project("[DocsWebsite] delete\n", "destroy")).resolves.toEqual(
      [
        {
          action: "delete",
          logicalId: "DocsWebsite",
          resourceType: "Cloudflare.Worker",
        },
      ]
    );
    await expect(project("", "destroy")).resolves.toEqual([
      {
        action: "noop",
        logicalId: "DocsWebsite",
        resourceType: "Cloudflare.Worker",
      },
    ]);
  });

  test("accepts only the bounded legacy deletion projection", async () => {
    await expect(
      project("[DocsBuild] delete\n[DocsWebsite] noop\n", "migrate")
    ).resolves.toEqual([
      {
        action: "delete",
        logicalId: "DocsBuild",
        resourceType: "Command.Build",
      },
      {
        action: "noop",
        logicalId: "DocsWebsite",
        resourceType: "Cloudflare.Worker",
      },
    ]);
    await expect(
      project("[DocsBuild] delete\n[DocsWebsite] update\n", "migrate")
    ).rejects.toHaveProperty("_tag", "WorkflowPlanProjectionError");
    await expect(
      project("[DocsWebsite] noop\n", "migrate")
    ).rejects.toHaveProperty("_tag", "WorkflowPlanProjectionError");
  });

  test("rejects unknown resources and deployment deletion", async () => {
    await expect(
      project("[Unexpected] create\n", "deploy")
    ).rejects.toHaveProperty("_tag", "WorkflowPlanProjectionError");
    await expect(
      project("[DocsWebsite] delete\n", "deploy")
    ).rejects.toHaveProperty("_tag", "WorkflowPlanProjectionError");
  });

  test("ignores beta.64 timestamp log lines and ANSI colour", async () => {
    await expect(
      project(
        "\u001B[32m[DocsWebsite] update\u001B[0m\n[12:34:56] INFO plan\n",
        "deploy"
      )
    ).resolves.toHaveLength(1);
  });
});
