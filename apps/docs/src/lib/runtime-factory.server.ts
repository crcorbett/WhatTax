import "@tanstack/react-start/server-only";
import type { DocsContentService } from "@taxkit/docs-content/service";
import type { Layer } from "effect";
import { ManagedRuntime } from "effect";

export const makeDocsRuntime = <E>(
  layer: Layer.Layer<DocsContentService, E, never>
) => ManagedRuntime.make(layer);
