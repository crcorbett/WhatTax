import { Array, Effect, Layer, Option, Schema } from "effect";

import {
  FumadocsPageNotFoundError,
  FumadocsSourceLoadError,
} from "./errors.js";
import { FumadocsSourcePages } from "./schemas.js";
import type { FumadocsSourcePages as FumadocsSourcePagesValue } from "./schemas.js";
import { FumadocsSource } from "./service.js";

export const makeFumadocsSourceTest = (fixtures: FumadocsSourcePagesValue) =>
  Layer.effect(
    FumadocsSource,
    Schema.decodeUnknownEffect(FumadocsSourcePages)(fixtures).pipe(
      Effect.mapError(
        () =>
          new FumadocsSourceLoadError({
            message: "The deterministic Fumadocs fixtures were invalid.",
            operation: "listPages",
          })
      ),
      Effect.map((pages) =>
        FumadocsSource.of({
          getPage: (slugs, locale) =>
            Array.findFirst(
              pages,
              (page) => page.slugs.join("/") === slugs.join("/")
            ).pipe(
              Option.match({
                onNone: () =>
                  Effect.fail(
                    new FumadocsPageNotFoundError({
                      locale,
                      slugs,
                    })
                  ),
                onSome: Effect.succeed,
              })
            ),
          listPages: () => Effect.succeed(pages),
        })
      )
    )
  );
