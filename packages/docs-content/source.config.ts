import { fileURLToPath } from "node:url";

import {
  defineFumadocsConfig,
  defineFumadocsDocsWithMeta,
  effectSchemaToStandardSchema,
} from "@taxkit/docs-fumadocs/config";

import { DocsMeta, DocsPageFrontmatter } from "./src/schemas.ts";

const docsFrontmatterSchema = effectSchemaToStandardSchema(DocsPageFrontmatter);

const docsMetaSchema = effectSchemaToStandardSchema(DocsMeta);

const docsCollection = defineFumadocsDocsWithMeta({
  dir: fileURLToPath(new URL("content", import.meta.url)),
  frontmatterSchema: docsFrontmatterSchema,
  metaSchema: docsMetaSchema,
});

export const docs: typeof docsCollection = {
  ...docsCollection,
  docs: {
    ...docsCollection.docs,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
};

export default defineFumadocsConfig();
