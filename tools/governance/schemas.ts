import { Schema } from "effect";

const NonEmpty = Schema.NonEmptyString;
const FindingId = Schema.String.check(Schema.isPattern(/^HE-[0-9]{3}$/u));
const InvariantId = Schema.String.check(
  Schema.isPattern(/^HC-[A-Z]+-[0-9]{3}$/u)
);
const SurfaceDecision = Schema.Struct({
  decision: Schema.Literals(["change_required", "preserve", "not_applicable"]),
  evidence: Schema.NonEmptyArray(NonEmpty),
});
const Surfaces = Schema.Struct({
  architecture_standards: SurfaceDecision,
  config_exports: SurfaceDecision,
  critical_journeys: SurfaceDecision,
  docs: SurfaceDecision,
  lifecycle: SurfaceDecision,
  lint_config_ci: SurfaceDecision,
  proof_evidence: SurfaceDecision,
  readmes: SurfaceDecision,
  release_rollback: SurfaceDecision,
  runbooks: SurfaceDecision,
  skills: SurfaceDecision,
  spec_tasks: SurfaceDecision,
  tests_fixtures: SurfaceDecision,
});
const Evidence = Schema.Struct({
  lineEnd: Schema.NullOr(Schema.Number),
  lineStart: Schema.NullOr(Schema.Number),
  observation: NonEmpty,
  path: NonEmpty,
});

export const AuditScope = Schema.Struct({
  acceptedLocalDecisions: Schema.NonEmptyArray(NonEmpty),
  acceptedOutcomes: Schema.NonEmptyArray(NonEmpty),
  authority: Schema.Struct({
    approvalReceipt: Schema.NullOr(NonEmpty),
    externalAccess: Schema.Literals(["none", "read_only", "mutation"]),
    inspection: Schema.Literal("read_only"),
    localMutation: Schema.Boolean,
  }),
  claimedJobs: Schema.NonEmptyArray(NonEmpty),
  deepReads: Schema.NonEmptyArray(
    Schema.Struct({
      classification: Schema.Literals([
        "current",
        "canonical",
        "affected",
        "contradictory",
        "generated_owner",
        "historical_evidence",
        "trajectory_evidence",
      ]),
      path: NonEmpty,
      reason: NonEmpty,
    })
  ),
  exclusions: Schema.NonEmptyArray(NonEmpty),
  externalObservations: Schema.Array(Schema.Unknown),
  id: NonEmpty,
  inventoryGroups: Schema.NonEmptyArray(
    Schema.Struct({
      artifact: NonEmpty,
      count: Schema.Number,
      id: NonEmpty,
      selection: NonEmpty,
      status: Schema.Literals([
        "accounted",
        "partial",
        "inaccessible",
        "not_applicable",
      ]),
    })
  ),
  lifecyclePhase: NonEmpty,
  limitations: Schema.NonEmptyArray(NonEmpty),
  nonClaims: Schema.NonEmptyArray(NonEmpty),
  profile: NonEmpty,
  proofBoundaries: Schema.NonEmptyArray(NonEmpty),
  representativeJourneyIds: Schema.NonEmptyArray(NonEmpty),
  schemaVersion: Schema.Literal("1"),
  stopConditions: Schema.NonEmptyArray(NonEmpty),
  target: Schema.Struct({
    branch: Schema.NullOr(NonEmpty),
    observedAt: NonEmpty,
    path: NonEmpty,
    repository: NonEmpty,
    revision: NonEmpty,
    upstream: Schema.NullOr(NonEmpty),
    worktreeState: Schema.Literals(["clean", "dirty", "not_versioned"]),
  }),
});
export type AuditScope = typeof AuditScope.Type;

export const AuditFindings = Schema.Struct({
  auditId: NonEmpty,
  findings: Schema.NonEmptyArray(
    Schema.Struct({
      authorityOrDecision: NonEmpty,
      decision: Schema.Literals([
        "proposed",
        "accepted",
        "rejected",
        "deferred",
        "optional",
      ]),
      evidence: Schema.NonEmptyArray(Evidence),
      id: FindingId,
      invariantIds: Schema.NonEmptyArray(InvariantId),
      journeyIds: Schema.Array(NonEmpty),
      lifecycleOrDecision: NonEmpty,
      limitations: Schema.NonEmptyArray(NonEmpty),
      nonClaims: Schema.NonEmptyArray(NonEmpty),
      priority: Schema.Literals([
        "important_correction",
        "optional_improvement",
      ]),
      proofGap: NonEmpty,
      retire: Schema.Array(NonEmpty),
      risk: NonEmpty,
      rootCorrection: NonEmpty,
      semanticOwner: NonEmpty,
      surfaces: Surfaces,
      verification: Schema.NonEmptyArray(NonEmpty),
    })
  ),
  foundationsToPreserve: Schema.Array(
    Schema.Struct({
      evidence: Schema.NonEmptyArray(Evidence),
      id: NonEmpty,
      owner: NonEmpty,
      summary: NonEmpty,
    })
  ),
  limitations: Schema.NonEmptyArray(NonEmpty),
  nonClaims: Schema.NonEmptyArray(NonEmpty),
  schemaVersion: Schema.Literal("1"),
  targetRevision: NonEmpty,
});
export type AuditFindings = typeof AuditFindings.Type;

export const AcceptedFindings = Schema.Struct({
  auditId: NonEmpty,
  entries: Schema.NonEmptyArray(
    Schema.Struct({
      findingId: FindingId,
      owningPaths: Schema.NonEmptyArray(NonEmpty),
      proof: Schema.NonEmptyArray(NonEmpty),
      requirementIds: Schema.NonEmptyArray(NonEmpty),
      taskIds: Schema.NonEmptyArray(NonEmpty),
      verification: Schema.NonEmptyArray(NonEmpty),
    })
  ),
  schemaVersion: Schema.Literal("1"),
  targetRevision: NonEmpty,
});
export type AcceptedFindings = typeof AcceptedFindings.Type;

const PathArray = Schema.NonEmptyArray(NonEmpty);
export const RepositoryHarnessProfile = Schema.Struct({
  boundaryFacts: Schema.NonEmptyArray(NonEmpty),
  commands: Schema.Struct({
    closeout: PathArray,
    documentation: PathArray,
    focused: PathArray,
    skills: PathArray,
  }),
  criticalJourneyOwner: NonEmpty,
  exceptions: Schema.Array(Schema.Unknown),
  exclusions: Schema.NonEmptyArray(NonEmpty),
  identitySource: NonEmpty,
  lifecyclePhase: NonEmpty,
  nonClaims: Schema.NonEmptyArray(NonEmpty),
  owners: Schema.Struct({
    activePlans: PathArray,
    activeSpecs: PathArray,
    agentGuidance: PathArray,
    architecture: PathArray,
    archives: PathArray,
    docsRouter: NonEmpty,
    evidence: PathArray,
    generatedReference: PathArray,
    proof: PathArray,
    readmes: PathArray,
    runbooks: PathArray,
    skills: PathArray,
    standards: PathArray,
  }),
  purpose: NonEmpty,
  repository: Schema.Literal("taxkit"),
  representativeJobs: Schema.NonEmptyArray(
    Schema.Struct({
      acceptedOutcome: NonEmpty,
      consumer: NonEmpty,
      id: NonEmpty,
      owningPaths: PathArray,
    })
  ),
  schemaVersion: Schema.Literal("1"),
});
export type RepositoryHarnessProfile = typeof RepositoryHarnessProfile.Type;
