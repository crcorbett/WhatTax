import type { FumadocsSourcePages } from "@taxkit/docs-fumadocs/schemas";
import { makeFumadocsSourceTest } from "@taxkit/docs-fumadocs/test";
import { Layer } from "effect";

import { DocsContentServiceLive } from "./live.layer.js";

export const makeDocsContentServiceTest = (fixtures: FumadocsSourcePages) =>
  DocsContentServiceLive.pipe(Layer.provide(makeFumadocsSourceTest(fixtures)));
