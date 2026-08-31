import { Option, Schema } from "effect";

import { FumadocsCodeBlockMeta } from "./schemas.ts";

interface CodeBlockNode {
  readonly properties: Record<
    string,
    boolean | number | string | null | undefined | readonly (number | string)[]
  >;
}

interface CodeBlockOptions {
  readonly lang?: string | undefined;
  readonly meta?: typeof Schema.Unknown.Type;
}

export const applyCodeBlockMeta = (
  node: CodeBlockNode,
  options: CodeBlockOptions
): void => {
  Schema.decodeUnknownOption(FumadocsCodeBlockMeta)(options.meta).pipe(
    Option.flatMap((meta) => Option.fromUndefinedOr(meta.title)),
    Option.map((title) => {
      node.properties["data-title"] = title;
      return title;
    })
  );

  Option.fromUndefinedOr(options.lang).pipe(
    Option.map((language) => {
      node.properties["data-language"] = language;
      return language;
    })
  );
};
