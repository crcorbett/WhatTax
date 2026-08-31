import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { DocsContentService } from "@taxkit/docs-content/service";
import { Effect, Layer } from "effect";
import { describe, expect, test } from "vitest";

import {
  createDocsRuntime,
  createDocsRuntimeProbeLayer,
  readDocsRuntimeProbe,
} from "./runtime-factory.server";

describe("docs server runtime ownership", () => {
  test("owns content and deterministic proof state for the managed lifetime", async () => {
    const service = DocsContentService.of({
      getNavigation: () => Effect.die("not used"),
      getPage: () => Effect.die("not used"),
      listPages: () => Effect.die("not used"),
      validateContent: () => Effect.die("not used"),
    });
    const runtime = createDocsRuntime(
      Layer.succeed(DocsContentService, service),
      createDocsRuntimeProbeLayer(Effect.succeed("deterministic-test-isolate"))
    );

    const [firstService, firstProbe, secondService, secondProbe] =
      await runtime.runPromise(
        Effect.all(
          [
            Effect.service(DocsContentService),
            readDocsRuntimeProbe,
            Effect.service(DocsContentService),
            readDocsRuntimeProbe,
          ],
          { concurrency: 4 }
        )
      );

    expect(firstService).toBe(service);
    expect(secondService).toBe(firstService);
    expect(firstProbe).toEqual({
      constructions: 1,
      isolateId: "deterministic-test-isolate",
    });
    expect(secondProbe).toEqual(firstProbe);
    await runtime.dispose();
  });

  test("owns one production runtime and one managed probe Layer at module scope", async () => {
    const runtimeSource = await readFile(
      fileURLToPath(new URL("runtime.server.ts", import.meta.url)),
      "utf-8"
    );

    expect(runtimeSource).toMatch(
      /export const docsRuntime = createDocsRuntime\(/u
    );
    expect(runtimeSource.match(/createDocsRuntime\(/gu)).toHaveLength(1);
    expect(runtimeSource.match(/createDocsRuntimeProbeLayer\(/gu)).toHaveLength(
      1
    );
    expect(runtimeSource).toContain("Random.nextIntBetween");
    expect(runtimeSource).not.toContain("globalThis.crypto");
    expect(runtimeSource).not.toContain("Math.random");
  });
});
