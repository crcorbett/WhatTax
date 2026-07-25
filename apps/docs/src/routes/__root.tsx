import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import {
  DocsRouteError,
  DocsRouteNotFound,
  DocsRoutePending,
} from "#/components/docs-route-states";
import { requestDocsNavigationFocus } from "#/lib/navigation-focus";

import "../styles.css";

const RootShell = ({ children }: { readonly children: React.ReactNode }) => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      <a className="docs-skip-link" href="#docs-main">
        Skip to documentation
      </a>
      {children}
      <Scripts />
    </body>
  </html>
);

const RootComponent = () => {
  useEffect(() => {
    addEventListener("popstate", requestDocsNavigationFocus);

    return () => removeEventListener("popstate", requestDocsNavigationFocus);
  }, []);

  return (
    <main className="docs-app-shell" id="docs-main" tabIndex={-1}>
      <Outlet />
    </main>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: DocsRouteError,
  head: () => ({
    links: [
      {
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23172033'/%3E%3Cpath d='M9 11h14v3H9zM9 18h14v3H9z' fill='%23f8fafc'/%3E%3C/svg%3E",
        rel: "icon",
      },
    ],
    meta: [
      { charSet: "utf-8" },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      { title: "TaxKit Docs" },
      {
        content: "Public TaxKit engine, API and SDK documentation.",
        name: "description",
      },
    ],
  }),
  notFoundComponent: DocsRouteNotFound,
  pendingComponent: DocsRoutePending,
  shellComponent: RootShell,
});
