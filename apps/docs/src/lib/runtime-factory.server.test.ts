import { DocsContentService } from "@taxkit/docs-content/service";
import { Effect, Layer } from "effect";
import { describe, expect, test } from "vitest";

import { makeDocsRuntime } from "./runtime-factory.server";

describe("docs server runtime ownership", () => {
  test("reuses one Layer instance and gives the test owner explicit disposal", async () => {
    const service = DocsContentService.of({
      getNavigation: () => Effect.die("not used"),
      getPage: () => Effect.die("not used"),
      listPages: () => Effect.die("not used"),
      validateContent: () => Effect.die("not used"),
    });
    const runtime = makeDocsRuntime(Layer.succeed(DocsContentService, service));

    const first = await runtime.runPromise(Effect.service(DocsContentService));
    const second = await runtime.runPromise(Effect.service(DocsContentService));

    expect(first).toBe(service);
    expect(second).toBe(first);

    await runtime.dispose();
  });
});
