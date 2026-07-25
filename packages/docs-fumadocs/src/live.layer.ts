import { Effect, Layer, Option, Schema } from "effect";
import type { LoaderOutput } from "fumadocs-core/source";

import {
  FumadocsPageNotFoundError,
  FumadocsSourceLoadError,
} from "./errors.js";
import { FumadocsSourcePage, FumadocsSourcePages } from "./schemas.js";
import type { FumadocsSourcePage as FumadocsSourcePageValue } from "./schemas.js";
import { FumadocsSource } from "./service.js";

export interface FumadocsGeneratedCollectionAdapter {
  readonly getPage: (
    slugs: NonNullable<Parameters<LoaderOutput["getPage"]>[0]>,
    locale?: Parameters<LoaderOutput["getPage"]>[1]
  ) => unknown | Promise<unknown>;
  readonly listPages: (
    locale?: Parameters<LoaderOutput["getPages"]>[0]
  ) => unknown | Promise<unknown>;
}

export const makeFumadocsSourceLive = (
  adapter: FumadocsGeneratedCollectionAdapter
) =>
  Layer.succeed(
    FumadocsSource,
    FumadocsSource.of({
      getPage: (slugs, locale) =>
        Effect.tryPromise({
          catch: () =>
            new FumadocsSourceLoadError({
              message: "The Fumadocs page lookup failed.",
              operation: "getPage",
            }),
          try: () =>
            Promise.resolve(
              adapter.getPage(globalThis.Array.from(slugs), locale)
            ),
        }).pipe(
          Effect.flatMap((candidate) =>
            Option.fromUndefinedOr(candidate).pipe(
              Option.match({
                onNone: (): Effect.Effect<
                  FumadocsSourcePageValue,
                  FumadocsPageNotFoundError | FumadocsSourceLoadError
                > =>
                  Effect.fail(
                    new FumadocsPageNotFoundError({
                      locale,
                      slugs,
                    })
                  ),
                onSome: (
                  page
                ): Effect.Effect<
                  FumadocsSourcePageValue,
                  FumadocsPageNotFoundError | FumadocsSourceLoadError
                > =>
                  Schema.decodeUnknownEffect(FumadocsSourcePage)(page).pipe(
                    Effect.mapError(
                      () =>
                        new FumadocsSourceLoadError({
                          message:
                            "The Fumadocs page representation was invalid.",
                          operation: "getPage",
                        })
                    )
                  ),
              })
            )
          )
        ),
      listPages: (locale) =>
        Effect.tryPromise({
          catch: () =>
            new FumadocsSourceLoadError({
              message: "The Fumadocs page listing failed.",
              operation: "listPages",
            }),
          try: () => Promise.resolve(adapter.listPages(locale)),
        }).pipe(
          Effect.flatMap((candidate) =>
            Schema.decodeUnknownEffect(FumadocsSourcePages)(candidate).pipe(
              Effect.mapError(
                () =>
                  new FumadocsSourceLoadError({
                    message:
                      "The Fumadocs page-list representation was invalid.",
                    operation: "listPages",
                  })
              )
            )
          )
        ),
    })
  );
