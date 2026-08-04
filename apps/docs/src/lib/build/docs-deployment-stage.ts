import * as Schema from "effect/Schema";

const PreviewStage = Schema.String.check(Schema.isPattern(/^pr-[1-9]\d*$/u));

export const DocsDeploymentStage = Schema.Union([
  Schema.Literals(["prod"]),
  PreviewStage,
]).pipe(Schema.brand("taxkit/DocsDeploymentStage"));
