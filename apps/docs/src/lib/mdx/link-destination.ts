export type DocsHrefClassification =
  | Readonly<{ href: string | undefined; kind: "anchor" }>
  | Readonly<{ kind: "router"; to: string }>;

export const classifyDocsHref = (
  href: string | undefined,
  currentPath: string
): DocsHrefClassification => {
  if (
    href === undefined ||
    href.startsWith("#") ||
    href.startsWith("//") ||
    /^[a-z][a-z0-9+.-]*:/iu.test(href)
  ) {
    return { href, kind: "anchor" };
  }

  const isDocsDestination =
    href.startsWith("/") ||
    href.startsWith("?") ||
    /\.mdx(?=$|[?#])/u.test(href);

  if (!isDocsDestination) {
    return { href, kind: "anchor" };
  }

  const normalizedHref = href.replace(/\.mdx(?=$|[?#])/u, "");
  const resolved = new URL(normalizedHref, `https://docs.taxkit${currentPath}`);

  return {
    kind: "router",
    to: `${resolved.pathname}${resolved.search}${resolved.hash}`,
  };
};
