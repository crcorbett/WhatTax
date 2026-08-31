import "@tanstack/react-start/server-only";
import type { DocsContentService } from "@taxkit/docs-content/service";
import { Context, Effect, Layer, ManagedRuntime, Ref, Schema } from "effect";

export const DocsRuntimeProbeSnapshot = Schema.Struct({
  constructions: Schema.Literal(1),
  isolateId: Schema.NonEmptyString,
});
export type DocsRuntimeProbeSnapshot = typeof DocsRuntimeProbeSnapshot.Type;

export interface DocsRuntimeProbeContract {
  readonly read: Effect.Effect<DocsRuntimeProbeSnapshot>;
}

export class DocsRuntimeProbe extends Context.Service<
  DocsRuntimeProbe,
  DocsRuntimeProbeContract
>()("taxkit/DocsRuntimeProbe") {}

export const createDocsRuntimeProbeLayer = (
  makeIsolateId: Effect.Effect<string>
) =>
  Layer.effect(
    DocsRuntimeProbe,
    Effect.gen(function* makeDocsRuntimeProbe() {
      const constructions = yield* Ref.make(1 as const);
      const isolateId = yield* makeIsolateId;

      return DocsRuntimeProbe.of({
        read: Ref.get(constructions).pipe(
          Effect.map((count) => ({ constructions: count, isolateId }))
        ),
      });
    })
  );

export const createDocsRuntime = <E, E2>(
  contentLayer: Layer.Layer<DocsContentService, E, never>,
  probeLayer: Layer.Layer<DocsRuntimeProbe, E2, never>
) => ManagedRuntime.make(Layer.merge(contentLayer, probeLayer));

export const readDocsRuntimeProbe = Effect.gen(
  function* readDocsRuntimeProbeProgram() {
    const probe = yield* DocsRuntimeProbe;
    return yield* probe.read;
  }
);
