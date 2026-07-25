import { Link, useLocation } from "@tanstack/react-router";
import { Picture, Pre } from "@taxkit/docs-fumadocs/render";
import type { ComponentPropsWithoutRef } from "react";

import {
  consumeDocsNavigationFocus,
  requestDocsNavigationFocus,
} from "#/lib/navigation-focus";

import { classifyDocsHref } from "./link-destination";

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
