import "@tanstack/react-start/server-only";
import { DocsGeneratedFumadocsSourceLive } from "@taxkit/docs-content/generated-source";
import { DocsContentServiceLive } from "@taxkit/docs-content/live";
import { Effect, Layer, Random } from "effect";

import {
  createDocsRuntime,
  createDocsRuntimeProbeLayer,
} from "./runtime-factory.server";

const docsRuntimeProbeLive = createDocsRuntimeProbeLayer(
  Effect.all(
    [
      Random.nextIntBetween(0, Number.MAX_SAFE_INTEGER),
      Random.nextIntBetween(0, Number.MAX_SAFE_INTEGER),
    ],
    { concurrency: 2 }
  ).pipe(
    Effect.map((segments) =>
      segments.map((segment) => segment.toString(36)).join("-")
    )
  )
);

export const docsRuntime = createDocsRuntime(
  DocsContentServiceLive.pipe(Layer.provide(DocsGeneratedFumadocsSourceLive)),
  docsRuntimeProbeLive
);
