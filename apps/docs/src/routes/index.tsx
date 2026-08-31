import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
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
import { requestDocsNavigationFocus } from "#/lib/navigation-focus";

const DocsHomeFailure = ({ onRetry }: { readonly onRetry: () => void }) => (
  <DocsRecoverableError
    message="The documentation source could not be loaded."
    onRetry={onRetry}
  />
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
      <h1 id="docs-page-heading" tabIndex={-1}>
        Open-source tax engine, API and SDK documentation
      </h1>
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
            onClick={requestDocsNavigationFocus}
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
  component: function DocsHomeRoute() {
    const loaderData = Route.useLoaderData();
    const router = useRouter();
    const routeResult = docsHomeRouteBoundary.restore(loaderData);

    return Result.match(routeResult, {
      onFailure: () => (
        <DocsHomeFailure
          onRetry={() => {
            void router.invalidate();
          }}
        />
      ),
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
