import { createFileRoute, Link } from "@tanstack/react-router";
import type {
  DocsContentPage,
  DocsNavigation as DocsNavigationValue,
} from "@taxkit/docs-content/schemas";
import { Array, Match, Option, Result, pipe } from "effect";

import {
  DocsRecoverableError,
  DocsRouteError,
  DocsRouteNotFound,
  DocsRoutePending,
} from "#/components/docs-route-states";
import { loadDocsPage } from "#/lib/docs/loaders";
import { docsPageRouteBoundary } from "#/lib/docs/route-boundary";
import { MdxDocument } from "#/lib/mdx/client-loader";

type DocsPageRouteError = Result.Result.Failure<
  ReturnType<typeof docsPageRouteBoundary.restore>
>;

const DocsRouteFailure = ({ error }: { readonly error: DocsPageRouteError }) =>
  Match.value(error).pipe(
    Match.tags({
      DocsContentPreloadError: (preloadError) => (
        <DocsRecoverableError message={preloadError.message} />
      ),
      DocsRouteTransportError: () => (
        <DocsRecoverableError message="The documentation route data could not be read." />
      ),
      DocsSourceError: () => (
        <DocsRecoverableError message="The documentation source could not be loaded." />
      ),
    }),
    Match.exhaustive
  );

const DocsNavigation = ({
  currentPath,
  navigation,
}: Readonly<{
  currentPath: DocsContentPage["path"];
  navigation: DocsNavigationValue;
}>) => (
  <aside className="docs-nav">
    <Link className="docs-nav__home" to="/">
      TaxKit Docs
    </Link>
    {pipe(
      navigation.primaryNavigation,
      Array.map((section) => (
        <section className="docs-nav__section" key={section.path}>
          <Link
            className="docs-nav__section-link"
            params={{ _splat: section.path.slice(1) }}
            to="/$"
          >
            {section.title}
          </Link>
          {Option.fromUndefinedOr(section.pages).pipe(
            Option.match({
              onNone: () => null,
              onSome: (items) => (
                <div className="docs-nav__links">
                  {pipe(
                    items,
                    Array.map((item) => (
                      <Link
                        className="docs-nav__link"
                        data-active={item.path === currentPath}
                        key={item.path}
                        params={{ _splat: item.path.slice(1) }}
                        to="/$"
                      >
                        {item.title}
                      </Link>
                    ))
                  )}
                </div>
              ),
            })
          )}
        </section>
      ))
    )}
  </aside>
);

const DocsArticle = ({ page }: { readonly page: DocsContentPage }) => (
  <article className="docs-article">
    <div className="docs-article__meta">
      <span>{page.frontmatter.status}</span>
      <span>{page.source}</span>
    </div>
    <MdxDocument source={page.source} />
  </article>
);

const DocsPageLayout = ({
  navigation,
  page,
}: Readonly<{
  navigation: DocsNavigationValue;
  page: DocsContentPage;
}>) => (
  <div className="docs-page-layout">
    <DocsNavigation currentPath={page.path} navigation={navigation} />
    <DocsArticle page={page} />
  </div>
);

export const Route = createFileRoute("/$")({
  component() {
    const loaderData = Route.useLoaderData();
    const routeResult = docsPageRouteBoundary.restore(loaderData);

    return Result.match(routeResult, {
      onFailure: (error) => <DocsRouteFailure error={error} />,
      onSuccess: ({ navigation, page }) => (
        <DocsPageLayout navigation={navigation} page={page} />
      ),
    });
  },
  errorComponent: DocsRouteError,
  loader: loadDocsPage,
  notFoundComponent: DocsRouteNotFound,
  pendingComponent: DocsRoutePending,
  pendingMs: 150,
});
