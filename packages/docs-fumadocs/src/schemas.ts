import { Schema } from "effect";

export const FumadocsNonEmptyText = Schema.Trimmed.check(Schema.isMinLength(1));
export type FumadocsNonEmptyText = typeof FumadocsNonEmptyText.Type;

export const FumadocsCodeBlockMeta = Schema.Struct({
  title: Schema.optional(FumadocsNonEmptyText),
});
export type FumadocsCodeBlockMeta = typeof FumadocsCodeBlockMeta.Type;

export const FumadocsSourceOperation = Schema.Literals([
  "getPage",
  "listPages",
]);
export type FumadocsSourceOperation = typeof FumadocsSourceOperation.Type;

export const FumadocsSourcePage = Schema.Struct({
  browserPath: FumadocsNonEmptyText,
  frontmatter: Schema.Record(Schema.String, Schema.Json),
  markdown: Schema.String,
  slugs: Schema.Array(Schema.String),
  sourcePath: FumadocsNonEmptyText,
});
export type FumadocsSourcePage = typeof FumadocsSourcePage.Type;

export const FumadocsSourcePages = Schema.Array(FumadocsSourcePage);
export type FumadocsSourcePages = typeof FumadocsSourcePages.Type;
