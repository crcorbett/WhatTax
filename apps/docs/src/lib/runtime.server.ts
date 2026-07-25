import "@tanstack/react-start/server-only";
import { DocsGeneratedFumadocsSourceLive } from "@taxkit/docs-content/generated-source";
import { DocsContentServiceLive } from "@taxkit/docs-content/live";
import { Layer } from "effect";

import { makeDocsRuntime } from "./runtime-factory.server";

export const docsRuntime = makeDocsRuntime(
  DocsContentServiceLive.pipe(Layer.provide(DocsGeneratedFumadocsSourceLive))
);
