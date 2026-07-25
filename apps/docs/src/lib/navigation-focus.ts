const focusIntentAttribute = "data-docs-focus-heading";

export const requestDocsNavigationFocus = () => {
  document.documentElement.setAttribute(focusIntentAttribute, "true");
};

export const consumeDocsNavigationFocus = (): boolean => {
  const requested =
    document.documentElement.getAttribute(focusIntentAttribute) === "true";

  if (requested) {
    document.documentElement.removeAttribute(focusIntentAttribute);
  }

  return requested;
};
