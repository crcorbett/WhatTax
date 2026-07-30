import { Effect } from "effect";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import {
  decodeDocsDeploymentStage,
  docsWorkerAssetHeaders,
  docsWorkerObservability,
} from "./cloudflare-stack";

describe("docs Cloudflare stack policy", () => {
  it.each(["prod", "pr-1", "pr-214"])(
    "accepts the owned deployment stage %s",
    (stage) => {
      expect(Effect.runSync(decodeDocsDeploymentStage(stage))).toBe(stage);
    }
  );

  it.each(["", "preview", "pr-0", "pr-01", "prod-2"])(
    "rejects the unowned deployment stage %s",
    (stage) => {
      expect(
        Effect.runSyncExit(decodeDocsDeploymentStage(stage))._tag
      ).toBe("Failure");
    }
  );

  it("keeps built-in logs bounded and traces disabled", () => {
    expect(docsWorkerObservability).toEqual({
      enabled: true,
      headSamplingRate: 1,
      logs: {
        enabled: true,
        headSamplingRate: 1,
        invocationLogs: true,
        persist: true,
      },
      traces: {
        enabled: false,
        headSamplingRate: 0,
        persist: false,
      },
    });
  });

  it("keeps the Vite and Alchemy asset-header inputs identical", async () => {
    const headers = await readFile(
      new URL("../../../public/_headers", import.meta.url),
      "utf-8"
    );

    expect(headers).toBe(docsWorkerAssetHeaders);
  });
});
