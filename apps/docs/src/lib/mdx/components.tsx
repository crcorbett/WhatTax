import { Link, useLocation } from "@tanstack/react-router";
import { Picture, Pre } from "@taxkit/docs-fumadocs/render";
import type { ComponentPropsWithoutRef } from "react";

import {
  consumeDocsNavigationFocus,
  requestDocsNavigationFocus,
} from "#/lib/navigation-focus";

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

const DocsMdxLink = ({
  children,
  download,
  href,
  ...props
}: ComponentPropsWithoutRef<"a">) => {
  const currentPath = useLocation({ select: (location) => location.pathname });
  const destination =
    download === undefined && props.target === undefined
      ? classifyDocsHref(href, currentPath)
      : ({ href, kind: "anchor" } as const);

  return destination.kind === "router" ? (
    <Link
      {...(props["aria-label"] === undefined
        ? {}
        : { "aria-label": props["aria-label"] })}
      {...(props.className === undefined ? {} : { className: props.className })}
      {...(props.id === undefined ? {} : { id: props.id })}
      {...(props.title === undefined ? {} : { title: props.title })}
      onClick={(event) => {
        requestDocsNavigationFocus();
        props.onClick?.(event);
      }}
      to={destination.to}
    >
      {children}
    </Link>
  ) : (
    <a {...props} download={download} href={destination.href}>
      {children}
    </a>
  );
};

const focusDocsHeadingWhenRequested = (heading: HTMLHeadingElement | null) => {
  if (heading !== null && consumeDocsNavigationFocus()) {
    heading.focus();
  }
};

const DocsMdxHeading = ({
  children,
  ...props
}: ComponentPropsWithoutRef<"h1">) => (
  <h1
    {...props}
    id="docs-page-heading"
    ref={focusDocsHeadingWhenRequested}
    tabIndex={-1}
  >
    {children}
  </h1>
);

export const mdxComponents = {
  a: DocsMdxLink,
  h1: DocsMdxHeading,
  img: Picture,
  pre: Pre,
};
