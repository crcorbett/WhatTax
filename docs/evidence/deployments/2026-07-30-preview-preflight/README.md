---
document_type: deployment-evidence-receipt
lifecycle: current
authority: canonical
owner: taxkit-docs-deployment-operation-owner
last_reviewed: 2026-07-30
review_trigger: exact candidate, GitHub PR identity, Cloudflare identity, authority or stop change
---

# DCD-002 Preview preflight stop

The authorized implementation thread read back the local candidate, GitHub
identity/candidate status, Alchemy Cloudflare profile and Wrangler credential
status. Alchemy had a valid OAuth profile for the sanitized account identity,
while Wrangler's independent session was expired. GitHub did not know the
local DCD-001 commit, so it could not be a trusted PR head.

No Alchemy state read, plan, deployment, teardown or provider mutation ran.
Account plan, Workers subdomain and exact Cloudflare credential scopes were
not read because the earlier trusted-candidate stop already prohibited the
state/plan boundary.
At that attempt, push and PR creation remained outside the authority envelope.
The immutable failed machine record is `authority-preflight.json`.

Cooper subsequently authorized the exact recovery in `git-authority.json`:
create and push
`codex/docs-cloudflare-alchemy-deployment` at candidate
`669a8f3bc484ddf5975f40940c8bdc14e6f1ba11`, create one draft pull request
against `main`, read it back, and later push coherent accepted DCD slices to
the same branch. That authority record precedes mutation and therefore makes
no success claim. Merge, force-push, branch deletion, conversion to ready,
release/tag/publication and unrelated GitHub mutation remain excluded.

`git-readback.json` then records the successful remote postcondition: draft
pull request `#1` is open against `main`, and its
`codex/docs-cloudflare-alchemy-deployment` head initially equalled DCD-001
candidate `669a8f3bc484ddf5975f40940c8bdc14e6f1ba11`. The first real Alchemy plan
then rejected JavaScript coercion of `Command.Build.outdir` before provider
mutation. The narrow public-API correction was committed as
`12c09122a388ffbad666630f3796ff404ea7aad7`, pushed under the admitted
accepted-slice authority, and read back as the same draft PR's current head.
The deterministic Preview stage remains `pr-1`. This is Git candidate proof
only; provider and state observations live in the dated Preview directory.
