export const delayedPageLoad = {
  delayMs: 800,
  id: "delayed-page-load",
  path: "/guides/calculate-australian-take-home-pay",
  visiblePostcondition: "Loading documentation",
} as const;

export const recoverableSourceError = {
  id: "recoverable-source-error",
  message: "The documentation source could not be loaded.",
  visiblePostcondition: "Docs page is unavailable",
} as const;
