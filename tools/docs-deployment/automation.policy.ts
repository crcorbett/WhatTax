import { HashSet } from "effect";

import type {
  DeploymentAutomation,
  DeploymentControl,
} from "./automation.schemas.js";
import { DeploymentAutomationFinding } from "./automation.schemas.js";

const expectedAutomationIds = [
  "docs-preview-delivery",
  "docs-production-delivery",
  "docs-preview-teardown",
  "docs-orphan-inventory",
] as const;

const expectedControlIds = [
  "docs-workflow-candidate-trust",
  "docs-workflow-mutation-lock",
  "docs-preview-teardown-safety",
  "docs-orphan-report-only",
] as const;

const finding = (
  invariant: (typeof DeploymentAutomationFinding.Type)["invariant"],
  target: string,
  recovery: string
) => new DeploymentAutomationFinding({ invariant, recovery, target });

const hasExactIds = (actual: readonly string[], expected: readonly string[]) =>
  actual.length === expected.length &&
  HashSet.size(HashSet.fromIterable(actual)) === expected.length &&
  expected.every((id) => actual.includes(id));

const hasExactStrings = (
  actual: readonly string[],
  expected: readonly string[]
) =>
  actual.length === expected.length &&
  HashSet.size(HashSet.fromIterable(actual)) === expected.length &&
  expected.every((value) => actual.includes(value));

const previewMutationGroup = ["taxkit-docs-preview-", "$", "{stage}"].join("");

const inspectMutation = (
  automation: DeploymentAutomation
): readonly DeploymentAutomationFinding[] => {
  if (automation.id === "docs-orphan-inventory") {
    return [];
  }
  const expected = {
    "docs-preview-delivery": {
      credentials: ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"],
      denied: [
        "automatic-orphan-deletion",
        "credential-write",
        "custom-domain-or-dns",
        "release-or-publication",
        "unrelated-provider-resource",
      ],
      environment: "taxkit-docs-preview",
      group: previewMutationGroup,
      operation: "preview-deploy",
      principal: "taxkit-docs-preview-workflow",
      resources: [
        "TaxKitDocsCloudflare/pr-N/DocsBuild",
        "TaxKitDocsCloudflare/pr-N/DocsWebsite",
      ],
      revisionSource: "exact same-repository pull-request head SHA",
      signal: "trusted-pull-request-dispatch",
      trigger:
        "separately dispatched trusted same-repository pull-request candidate",
    },
    "docs-preview-teardown": {
      credentials: ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"],
      denied: [
        "automatic-orphan-deletion",
        "credential-write",
        "custom-domain-or-dns",
        "release-or-publication",
        "unrelated-provider-resource",
      ],
      environment: "taxkit-docs-preview-teardown",
      group: previewMutationGroup,
      operation: "preview-destroy",
      principal: "taxkit-docs-preview-teardown-workflow",
      resources: [
        "TaxKitDocsCloudflare/pr-N/DocsBuild",
        "TaxKitDocsCloudflare/pr-N/DocsWebsite",
      ],
      revisionSource:
        "reviewed-default-branch-workflow-commit-plus-closed-pr-number",
      signal: "pull-request-closed",
      trigger: "same-repository pull request closed",
    },
    "docs-production-delivery": {
      credentials: ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"],
      denied: [
        "automatic-orphan-deletion",
        "credential-write",
        "custom-domain-or-dns",
        "release-or-publication",
        "unrelated-provider-resource",
      ],
      environment: "taxkit-docs-production",
      group: "taxkit-docs-production-prod",
      operation: "production-deploy",
      principal: "taxkit-docs-production-workflow",
      resources: [
        "TaxKitDocsCloudflare/prod/DocsBuild",
        "TaxKitDocsCloudflare/prod/DocsWebsite",
      ],
      revisionSource: "exact accepted candidate SHA",
      signal: "production-dispatch",
      trigger:
        "separately dispatched exact candidate after accepted Preview evidence",
    },
  }[automation.id];
  const lockMismatch = ![
    automation.environment.id === expected.environment,
    automation.authority.environment === expected.environment,
    automation.signal.kind === expected.signal,
    automation.lock.group === expected.group,
    automation.lock.scope === "stage",
    automation.lock.cancelInProgress === false,
    hasExactStrings(automation.authority.operations, [expected.operation]),
  ].every(Boolean);
  const findings = lockMismatch
    ? [
        finding(
          "mutation-lock",
          `tools/docs-deployment/automation-register.json:${automation.id}`,
          "Bind the exact protected environment, operation and non-cancellable stage lock."
        ),
      ]
    : [];
  const hasCandidateQualityStop =
    automation.id === "docs-preview-teardown" ||
    automation.failure.stopConditions.includes(
      "quality result is absent or belongs to another commit"
    );
  const candidateMismatch = ![
    automation.authority.principal === expected.principal,
    automation.environment.trigger === expected.trigger,
    automation.signal.revisionSource === expected.revisionSource,
    hasExactStrings(
      automation.authority.credentialIdentities,
      expected.credentials
    ),
    hasExactStrings(automation.authority.resources, expected.resources),
    hasExactStrings(automation.authority.denied, expected.denied),
    hasCandidateQualityStop,
  ].every(Boolean);
  if (candidateMismatch) {
    findings.push(
      finding(
        "candidate-trust",
        `tools/docs-deployment/automation-register.json:${automation.id}`,
        "Bind the exact principal, credential identities, resource set, denials, revision source, trigger and candidate Quality stop."
      )
    );
  }
  if (
    !automation.plan.acceptedDigestRequired ||
    !automation.plan.equalReplanRequired ||
    !automation.plan.providerReadbackRequired
  ) {
    findings.push(
      finding(
        "plan-equality",
        `tools/docs-deployment/automation-register.json:${automation.id}.plan`,
        "Require accepted canonical digest, equal replan and provider/state readback before mutation."
      )
    );
  }
  return findings;
};

// oxlint-disable-next-line eslint/complexity -- one bounded cross-register policy keeps the exact automation graph visible
export const inspectDeploymentAutomationRegisters = (
  automations: readonly DeploymentAutomation[],
  controls: readonly DeploymentControl[]
): readonly DeploymentAutomationFinding[] => {
  const findings: DeploymentAutomationFinding[] = [];
  if (
    !hasExactIds(
      automations.map((entry) => entry.id),
      expectedAutomationIds
    )
  ) {
    findings.push(
      finding(
        "automation-register",
        "tools/docs-deployment/automation-register.json",
        "Retain exactly Preview, Production, teardown and report-only orphan automation entries."
      )
    );
  }
  if (
    !hasExactIds(
      controls.map((entry) => entry.id),
      expectedControlIds
    )
  ) {
    findings.push(
      finding(
        "control-register",
        "tools/docs-deployment/controls.json",
        "Retain exactly the four deployment automation controls."
      )
    );
  }
  for (const automation of automations) {
    findings.push(...inspectMutation(automation));
    if (automation.externalState.status === "established") {
      findings.push(
        finding(
          "external-proof",
          `tools/docs-deployment/automation-register.json:${automation.id}.externalState`,
          "Keep external state not-established until a Schema-decoded hosted receipt owner verifies the exact workflow, environment, principal, candidate, lock, plan and provider identities."
        )
      );
    }
  }
  const teardown = automations.find(
    (entry) => entry.id === "docs-preview-teardown"
  );
  if (
    teardown === undefined ||
    teardown.signal.revisionSource !==
      "reviewed-default-branch-workflow-commit-plus-closed-pr-number" ||
    !teardown.failure.stopConditions.some((condition) =>
      condition.includes("pull-request head")
    )
  ) {
    findings.push(
      finding(
        "teardown-safety",
        "tools/docs-deployment/automation-register.json:docs-preview-teardown",
        "Use reviewed default-branch code, derive only pr-N and reject pull-request-head execution."
      )
    );
  }
  const orphan = automations.find(
    (entry) => entry.id === "docs-orphan-inventory"
  );
  if (
    orphan === undefined ||
    orphan.authority.principal !== "taxkit-docs-orphan-inventory-workflow" ||
    orphan.environment.id !== "github-actions-report-only" ||
    orphan.authority.environment !== "github-actions-report-only" ||
    orphan.environment.trigger !==
      "bounded schedule or explicit manual report" ||
    orphan.signal.kind !== "scheduled-or-manual-report" ||
    orphan.signal.revisionSource !==
      "reviewed default-branch workflow commit" ||
    orphan.lock.scope !== "report-only-inventory" ||
    orphan.lock.group !== "taxkit-docs-orphan-inventory" ||
    !orphan.lock.cancelInProgress ||
    orphan.authority.operations.length !== 1 ||
    orphan.authority.operations[0] !== "orphan-inventory-read" ||
    !hasExactStrings(orphan.authority.credentialIdentities, [
      "CLOUDFLARE_READ_API_TOKEN",
    ]) ||
    !hasExactStrings(orphan.authority.resources, [
      "open TaxKit pull-request identities",
      "TaxKitDocsCloudflare Alchemy stages",
      "TaxKit docs Cloudflare Worker names",
    ]) ||
    !hasExactStrings(orphan.authority.denied, [
      "automatic-orphan-deletion",
      "credential-write",
      "custom-domain-or-dns",
      "deployment",
      "provider-write",
      "release-or-publication",
    ]) ||
    orphan.plan.acceptedDigestRequired ||
    orphan.plan.equalReplanRequired ||
    !orphan.plan.providerReadbackRequired
  ) {
    findings.push(
      finding(
        "orphan-report-only",
        "tools/docs-deployment/automation-register.json:docs-orphan-inventory",
        "Keep orphan inventory cancellable, read-only, separately credentialed and unable to delete."
      )
    );
  }
  return findings.toSorted((left, right) =>
    `${left.invariant}:${left.target}`.localeCompare(
      `${right.invariant}:${right.target}`
    )
  );
};
