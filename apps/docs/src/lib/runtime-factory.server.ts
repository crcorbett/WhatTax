import "@tanstack/react-start/server-only";
import type { DocsContentService } from "@taxkit/docs-content/service";
import type { Layer } from "effect";
import { ManagedRuntime } from "effect";

let runtimeConstructionCount = 0;
let runtimeIsolateId: string | undefined;

export const makeDocsRuntime = <E>(
  layer: Layer.Layer<DocsContentService, E, never>
) => {
  runtimeConstructionCount += 1;

  return ManagedRuntime.make(layer);
};

export const readDocsRuntimeProbe = (): {
  readonly constructions: number;
  readonly isolateId: string;
} => {
  runtimeIsolateId ??= globalThis.crypto.randomUUID();

  return {
    constructions: runtimeConstructionCount,
    isolateId: runtimeIsolateId,
  };
};
