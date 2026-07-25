import { Schema } from "effect";

import { FumadocsNonEmptyText, FumadocsSourceOperation } from "./schemas.js";

export class FumadocsPageNotFoundError extends Schema.TaggedErrorClass<FumadocsPageNotFoundError>()(
  "FumadocsPageNotFoundError",
  {
    locale: Schema.optional(Schema.String),
    slugs: Schema.Array(Schema.String),
  }
) {}

export class FumadocsSourceLoadError extends Schema.TaggedErrorClass<FumadocsSourceLoadError>()(
  "FumadocsSourceLoadError",
  {
    message: FumadocsNonEmptyText,
    operation: FumadocsSourceOperation,
  }
) {}
