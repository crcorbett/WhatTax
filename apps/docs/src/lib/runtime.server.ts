import "@tanstack/react-start/server-only";
import { DocsGeneratedFumadocsSourceLive } from "@taxkit/docs-content/generated-source";
import { DocsContentServiceLive } from "@taxkit/docs-content/live";
import { Layer, ManagedRuntime } from "effect";

export const docsRuntime = ManagedRuntime.make(
  DocsContentServiceLive.pipe(Layer.provide(DocsGeneratedFumadocsSourceLive))
);
