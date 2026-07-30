import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { DocsContentService } from "@taxkit/docs-content/service";
import { Effect, Layer } from "effect";
import { describe, expect, test } from "vitest";

import {
  makeDocsRuntime,
  readDocsRuntimeProbe,
} from "./runtime-factory.server";

describe("docs server runtime ownership", () => {
  test("reuses one Layer instance and gives the test owner explicit disposal", async () => {
    const probeBefore = readDocsRuntimeProbe();
    const service = DocsContentService.of({
      getNavigation: () => Effect.die("not used"),
      getPage: () => Effect.die("not used"),
      listPages: () => Effect.die("not used"),
      validateContent: () => Effect.die("not used"),
    });
    const runtime = makeDocsRuntime(Layer.succeed(DocsContentService, service));
    const probeAfterConstruction = readDocsRuntimeProbe();

    const first = await runtime.runPromise(Effect.service(DocsContentService));
    const second = await runtime.runPromise(Effect.service(DocsContentService));

    expect(probeAfterConstruction).toEqual({
      constructions: probeBefore.constructions + 1,
      isolateId: probeBefore.isolateId,
    });
    expect(readDocsRuntimeProbe()).toEqual(probeAfterConstruction);
    expect(first).toBe(service);
    expect(second).toBe(first);
    await runtime.dispose();
  });

  test("owns one production runtime construction at module scope", async () => {
    const runtimeSource = await readFile(
      fileURLToPath(new URL("runtime.server.ts", import.meta.url)),
      "utf-8"
    );

    expect(runtimeSource).toMatch(
      /export const docsRuntime = makeDocsRuntime\(/u
    );
    expect(runtimeSource.match(/makeDocsRuntime\(/gu)).toHaveLength(1);
  });
});
