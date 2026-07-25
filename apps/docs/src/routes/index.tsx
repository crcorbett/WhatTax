import { createFileRoute, Link } from "@tanstack/react-router";
import type {
  DocsContentPage,
  DocsNavigation,
} from "@taxkit/docs-content/schemas";
import { Array, Result, pipe } from "effect";

import {
  DocsRecoverableError,
  DocsRouteError,
  DocsRoutePending,
} from "#/components/docs-route-states";
import { loadDocsHome } from "#/lib/docs/loaders";
import { docsHomeRouteBoundary } from "#/lib/docs/route-boundary";

const DocsHomeFailure = () => (
  <DocsRecoverableError message="The documentation source could not be loaded." />
);

const DocsHomeContent = ({
  navigation,
  pages,
}: Readonly<{
  navigation: DocsNavigation;
  pages: readonly DocsContentPage[];
}>) => (
  <section className="docs-home">
    <div className="docs-home__intro">
      <p className="docs-kicker">TaxKit docs</p>
      <h1>Open-source tax engine, API and SDK documentation</h1>
      <p>
        Start with the integration path, then move through SDK, API, guides,
        concepts, contribution notes and reference material.
      </p>
    </div>
    <nav aria-label="Primary documentation" className="docs-section-list">
      {pipe(
        navigation.primaryNavigation,
        Array.map((section) => (
          <Link
            className="docs-section-card"
            key={section.path}
            params={{ _splat: section.path.slice(1) }}
            to="/$"
          >
            <span>{section.title}</span>
            <small>{section.primaryReader}</small>
          </Link>
        ))
      )}
    </nav>
    <p className="docs-count">{pages.length} documentation pages loaded.</p>
  </section>
);

export const Route = createFileRoute("/")({
  component() {
    const loaderData = Route.useLoaderData();
    const routeResult = docsHomeRouteBoundary.restore(loaderData);

    return Result.match(routeResult, {
      onFailure: () => <DocsHomeFailure />,
      onSuccess: ({ navigation, pages }) => (
        <DocsHomeContent navigation={navigation} pages={pages} />
      ),
    });
  },
  errorComponent: DocsRouteError,
  loader: loadDocsHome,
  pendingComponent: DocsRoutePending,
  pendingMs: 150,
});
