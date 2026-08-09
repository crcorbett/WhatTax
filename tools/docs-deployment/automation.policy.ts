import { HashSet } from "effect";

import type {
  DeploymentAutomation,
  DeploymentControl,
} from "./automation.schemas.js";
import { DeploymentAutomationFinding } from "./automation.schemas.js";
import type {
  DeploymentWorkflowExternalEvidence,
  DeploymentWorkflowExternalReceipt,
  DeploymentWorkflowProviderReadback,
  DeploymentWorkflowRunReadback,
  DeploymentWorkflowTeardownReadback,
} from "./workflow-receipts.schemas.js";

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
  controls: readonly DeploymentControl[],
  externalReceipts: ReadonlyMap<
    DeploymentAutomation["id"],
    DeploymentWorkflowExternalReceipt
  > = new Map(),
  externalEvidence: ReadonlyMap<
    DeploymentAutomation["id"],
    DeploymentWorkflowExternalEvidence
  > = new Map()
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
      const receipt =
        automation.externalState.receipt === null
          ? undefined
          : externalReceipts.get(automation.id);
      const evidence = externalEvidence.get(automation.id);
      const plan = evidence?.plan ?? null;
      const provider = evidence?.provider ?? null;
      const hosted = evidence?.hosted ?? null;
      const workflowRun: DeploymentWorkflowRunReadback | null =
        evidence?.workflowRun ?? null;
      const workflowPath = (
        {
          "docs-orphan-inventory":
            ".github/workflows/docs-orphan-inventory.yml",
          "docs-preview-delivery": ".github/workflows/docs-preview.yml",
          "docs-preview-teardown":
            ".github/workflows/docs-preview-teardown.yml",
          "docs-production-delivery": ".github/workflows/docs-production.yml",
        } as const
      )[automation.id];
      const workflowName = (
        {
          "docs-orphan-inventory": "Docs Orphan Inventory (Report Only)",
          "docs-preview-delivery": "Docs Preview Deployment",
          "docs-preview-teardown": "Docs Preview Teardown",
          "docs-production-delivery": "Docs Production Deployment",
        } as const
      )[automation.id];
      let operationMismatch = receipt === undefined;
      if (!operationMismatch && receipt !== undefined) {
        if (automation.id === "docs-production-delivery") {
          operationMismatch = ![
            "production-deploy",
            "production-rollback",
          ].includes(receipt.operation);
        } else {
          let expectedOperation = "preview-destroy";
          if (automation.id === "docs-orphan-inventory") {
            expectedOperation = "orphan-inventory-read";
          } else if (automation.id === "docs-preview-delivery") {
            expectedOperation = "preview-deploy";
          }
          operationMismatch = receipt.operation !== expectedOperation;
        }
      }
      const isOrphan = automation.id === "docs-orphan-inventory";
      const isTeardown = automation.id === "docs-preview-teardown";
      const workflowProvider: DeploymentWorkflowProviderReadback | null =
        provider !== null && "acceptedPlanSha256" in provider ? provider : null;
      const teardownProvider: DeploymentWorkflowTeardownReadback | null =
        provider !== null && "providerWorkerAbsent" in provider
          ? provider
          : null;
      let providerIdentityMismatch = false;
      if (isOrphan) {
        providerIdentityMismatch =
          provider !== null || hosted !== null || plan !== null;
      } else if (isTeardown) {
        providerIdentityMismatch =
          teardownProvider === null ||
          teardownProvider.candidateCommit !== receipt?.candidateCommit ||
          teardownProvider.stage !== receipt?.stage ||
          teardownProvider.accountId !== receipt?.accountId ||
          teardownProvider.stateStoreId.length === 0;
      } else {
        providerIdentityMismatch =
          workflowProvider === null ||
          workflowProvider.candidateCommit !== receipt?.candidateCommit ||
          workflowProvider.stage !== receipt?.stage ||
          workflowProvider.acceptedPlanSha256 !== receipt?.acceptedPlanSha256 ||
          workflowProvider.accountId !== receipt?.accountId ||
          workflowProvider.configSha256 !== receipt?.configSha256 ||
          workflowProvider.deploymentInputSha256 !==
            receipt?.deploymentInputSha256 ||
          workflowProvider.lockfileSha256 !== receipt?.lockfileSha256 ||
          workflowProvider.previousVersionId !== receipt?.previousVersionId ||
          workflowProvider.rollbackRecoveryIdentity !==
            receipt?.rollbackRecoveryIdentity ||
          (workflowProvider.previewPrNumber === null
            ? workflowProvider.stage !== "prod"
            : workflowProvider.stage !==
              `pr-${workflowProvider.previewPrNumber}`);
      }
      let expectedPlanOperation = "production-equal-replan";
      if (receipt?.operation === "preview-deploy") {
        expectedPlanOperation = "preview-equal-replan";
      } else if (receipt?.operation === "preview-destroy") {
        expectedPlanOperation = "preview-destroy";
      }
      const planMismatch = isOrphan
        ? plan !== null
        : plan === null ||
          receipt === undefined ||
          plan.operation !== expectedPlanOperation ||
          plan.acceptedPlanSha256 !== receipt.acceptedPlanSha256 ||
          plan.projection.candidate.exactCommit !== receipt.candidateCommit ||
          plan.projection.stage !== receipt.stage ||
          plan.projection.configSha256 !== receipt.configSha256 ||
          plan.projection.candidate.deploymentInputSha256 !==
            receipt.deploymentInputSha256 ||
          plan.projection.candidate.lockfileSha256 !== receipt.lockfileSha256;
      let hostedIdentityMismatch = false;
      if (isOrphan) {
        hostedIdentityMismatch = hosted !== null;
      } else if (isTeardown) {
        hostedIdentityMismatch = hosted !== null;
      } else if (
        hosted === null ||
        receipt === undefined ||
        workflowProvider === null
      ) {
        hostedIdentityMismatch = true;
      } else {
        let expectedHostedEnvironment = "preview";
        if (receipt.operation === "production-rollback") {
          expectedHostedEnvironment = "rollback";
        } else if (workflowProvider.stage === "prod") {
          expectedHostedEnvironment = "production";
        }
        const screenshotKinds = new Set(
          hosted.screenshots.map(({ kind }) => kind)
        );
        hostedIdentityMismatch = [
          hosted.accountId !== workflowProvider.accountId,
          hosted.stateStoreId !== workflowProvider.stateStoreId,
          hosted.candidateCommit !== receipt.candidateCommit,
          hosted.stage !== workflowProvider.stage,
          hosted.acceptedPlanSha256 !== workflowProvider.acceptedPlanSha256,
          hosted.configSha256 !== workflowProvider.configSha256,
          hosted.deploymentInputSha256 !==
            workflowProvider.deploymentInputSha256,
          hosted.lockfileSha256 !== workflowProvider.lockfileSha256,
          hosted.previousVersionId !== workflowProvider.previousVersionId,
          hosted.previewPrNumber !== workflowProvider.previewPrNumber,
          hosted.rollbackRecoveryIdentity !==
            workflowProvider.rollbackRecoveryIdentity,
          hosted.deploymentId !== workflowProvider.deploymentId,
          hosted.versionId !== workflowProvider.versionId,
          hosted.workerName !== workflowProvider.workerName,
          hosted.url !== workflowProvider.url,
          hosted.diagnostics.length !== 0,
          hosted.environment !== expectedHostedEnvironment,
          hosted.screenshots.length !== 2,
          screenshotKinds.size !== 2,
          !screenshotKinds.has("desktop"),
          !screenshotKinds.has("mobile"),
        ].some(Boolean);
      }
      let workflowRunMismatch = workflowRun === null || receipt === undefined;
      if (
        !workflowRunMismatch &&
        workflowRun !== null &&
        receipt !== undefined
      ) {
        let allowedEvents: readonly string[] = ["workflow_dispatch"];
        if (isOrphan) {
          allowedEvents = ["schedule", "workflow_dispatch"];
        } else if (isTeardown) {
          allowedEvents = ["pull_request", "workflow_dispatch"];
        }
        workflowRunMismatch =
          workflowRun.workflowRunId !== receipt.workflowRunId ||
          workflowRun.candidateCommit !== receipt.candidateCommit ||
          workflowRun.headSha !== receipt.workflowCommit ||
          workflowRun.path !== receipt.workflowPath ||
          workflowRun.workflowName !== workflowName ||
          workflowRun.headBranch !== "main" ||
          workflowRun.ref !== "refs/heads/main" ||
          workflowRun.status !== "completed" ||
          workflowRun.conclusion !== "success" ||
          !allowedEvents.includes(workflowRun.event);
      }
      const receiptMismatch =
        receipt === undefined ||
        evidence === undefined ||
        automation.externalState.receipt !== receipt?.workflowReceiptPath ||
        receipt.automationId !== automation.id ||
        receipt.environment !== automation.environment.id ||
        receipt.principal !== automation.authority.principal ||
        receipt.lockGroup !== automation.lock.group ||
        operationMismatch ||
        receipt.workflowPath !== workflowPath ||
        (isOrphan
          ? receipt.acceptedPlanSha256 !== null ||
            receipt.planPath !== null ||
            receipt.hostedProofPath !== null
          : receipt.acceptedPlanSha256 === null ||
            receipt.planPath === null ||
            receipt.providerReadbackPath === null ||
            (isTeardown
              ? receipt.hostedProofPath !== null
              : receipt.hostedProofPath === null)) ||
        receipt.workflowRunPath.length === 0 ||
        workflowRunMismatch ||
        providerIdentityMismatch ||
        planMismatch ||
        hostedIdentityMismatch;
      if (receiptMismatch) {
        findings.push(
          finding(
            "external-proof",
            `tools/docs-deployment/automation-register.json:${automation.id}.externalState`,
            "Decode the named workflow receipt and verify exact workflow, environment, principal, stage lock, candidate, plan and provider/hosted postconditions before establishing external state."
          )
        );
      }
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
      "ALCHEMY_STATE_STORE_CREDENTIALS_JSON",
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
      "state-store-write",
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
