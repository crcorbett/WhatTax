import type { FumadocsGeneratedCollectionAdapter } from "@taxkit/docs-fumadocs/live";
import { makeFumadocsSourceLive } from "@taxkit/docs-fumadocs/live";
import { Option } from "effect";

import { source } from "./server.js";

type GeneratedPage = ReturnType<typeof source.getPages>[number];

const sourcePageRepresentation = async (page: GeneratedPage) => ({
  browserPath: page.path,
  frontmatter: {
    description: page.data.description,
    status: page.data.status,
    title: page.data.title,
  },
  markdown: await page.data.getText("processed"),
  slugs: page.slugs,
  sourcePath: `content/${page.path}`,
});

const generatedCollectionAdapter: FumadocsGeneratedCollectionAdapter = {
  getPage: (slugs, locale) =>
    Option.fromUndefinedOr(
      source.getPage(globalThis.Array.from(slugs), locale)
    ).pipe(
      Option.match({
        onNone: () => Option.none<never>().pipe(Option.getOrUndefined),
        onSome: sourcePageRepresentation,
      })
    ),
  listPages: (locale) =>
    Promise.all(
      globalThis.Array.from(source.getPages(locale), sourcePageRepresentation)
    ),
};

export const DocsGeneratedFumadocsSourceLive = makeFumadocsSourceLive(
  generatedCollectionAdapter
);
