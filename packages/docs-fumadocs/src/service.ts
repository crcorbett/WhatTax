import { Context } from "effect";
import type { Effect } from "effect";

import type {
  FumadocsPageNotFoundError,
  FumadocsSourceLoadError,
} from "./errors.js";
import type { FumadocsSourcePage } from "./schemas.js";

export interface FumadocsSourceShape {
  readonly getPage: (
    slugs: readonly string[],
    locale?: string
  ) => Effect.Effect<
    FumadocsSourcePage,
    FumadocsPageNotFoundError | FumadocsSourceLoadError
  >;
  readonly listPages: (
    locale?: string
  ) => Effect.Effect<readonly FumadocsSourcePage[], FumadocsSourceLoadError>;
}

export class FumadocsSource extends Context.Service<
  FumadocsSource,
  FumadocsSourceShape
>()("@taxkit/docs-fumadocs/FumadocsSource") {}
