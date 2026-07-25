import type { ErrorComponentProps } from "@tanstack/react-router";

export const DocsRoutePending = () => (
  <section
    aria-busy="true"
    aria-live="polite"
    className="docs-route-state"
    data-testid="route-pending"
  >
    <p className="docs-kicker">TaxKit docs</p>
    <h1>Loading documentation</h1>
    <p>The requested page is being prepared.</p>
  </section>
);

export const DocsRouteNotFound = () => (
  <section className="docs-route-state" data-testid="route-not-found">
    <p className="docs-kicker">TaxKit docs</p>
    <h1>Documentation page not found</h1>
    <p>The requested documentation page does not exist.</p>
  </section>
);

export const DocsRecoverableError = ({
  message,
  onRetry,
}: Readonly<{
  message: string;
  onRetry?: () => void;
}>) => (
  <section
    aria-live="polite"
    className="docs-route-state"
    data-testid="loader-error"
  >
    <p className="docs-kicker">TaxKit docs</p>
    <h1>Docs page is unavailable</h1>
    <p>{message}</p>
    {onRetry === undefined ? null : (
      <button onClick={onRetry} type="button">
        Try again
      </button>
    )}
  </section>
);

export const DocsRouteError = ({ reset }: ErrorComponentProps) => (
  <section
    aria-live="assertive"
    className="docs-route-state"
    data-testid="route-error"
  >
    <p className="docs-kicker">TaxKit docs</p>
    <h1>Documentation could not be rendered</h1>
    <p>An unexpected route error interrupted this page.</p>
    <button onClick={reset} type="button">
      Try again
    </button>
  </section>
);
