import type { ComponentType } from "react";

const Mdx: ComponentType<{
  readonly components: Readonly<Record<string, ComponentType>>;
}> = () => null;

const sharedMdxComponents: Readonly<Record<string, ComponentType>> = {};

export const AcceptedMdxRoute = () => <Mdx components={sharedMdxComponents} />;
