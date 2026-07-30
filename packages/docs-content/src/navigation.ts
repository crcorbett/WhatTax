import { Effect, Schema } from "effect";
import type { Effect as EffectType } from "effect";

import navigationRepresentation from "../navigation.json";
import { DocsSourceError } from "./errors.js";
import { DocsNavigation } from "./schemas.js";

export const getNavigation: EffectType.Effect<DocsNavigation, DocsSourceError> =
  Schema.decodeUnknownEffect(DocsNavigation)(navigationRepresentation).pipe(
    Effect.mapError(
      () =>
        new DocsSourceError({
          message: "The docs navigation representation was invalid.",
          operation: "getNavigation",
        })
    )
  );
