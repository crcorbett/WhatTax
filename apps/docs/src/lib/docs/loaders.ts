import { createServerFn } from "@tanstack/react-start";

const loadDocsHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { loadDocsHomeServer } = await import("./loaders.server");

  return await loadDocsHomeServer();
});
const loadDocsPageData = createServerFn({ method: "GET" })
  .inputValidator((input) => input)
  .handler(async ({ data }) => {
    const { loadDocsPageServer } = await import("./loaders.server");

    return await loadDocsPageServer(data);
  });

export const loadDocsHome = () => loadDocsHomeData();

export const loadDocsPage = (loaderContext: {
  readonly params: {
    readonly _splat: string;
  };
}) =>
  loadDocsPageData({
    data: {
      splat: loaderContext.params._splat,
    },
  });
