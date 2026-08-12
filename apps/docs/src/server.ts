import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { Effect, Schema } from "effect";

import {
  DocsRuntimeProbeSnapshot,
  readDocsRuntimeProbe,
} from "./lib/runtime-factory.server";
import { docsRuntime } from "./lib/runtime.server";

const startHandler = createStartHandler(defaultStreamHandler);
const runtimeProofRequestHeader = "x-taxkit-docs-runtime-proof";
const runtimeProofResponseHeader = "x-taxkit-docs-runtime-constructions";
const runtimeProofIsolateHeader = "x-taxkit-docs-runtime-isolate";

export default {
  fetch: async (request: Request) => {
    const response = await startHandler(request);

    if (
      request.headers.get(runtimeProofRequestHeader) !== "construction-count"
    ) {
      return response;
    }

    const probe = await docsRuntime.runPromise(
      readDocsRuntimeProbe.pipe(
        Effect.flatMap((snapshot) =>
          Schema.encodeUnknownEffect(DocsRuntimeProbeSnapshot)(snapshot)
        )
      )
    );
    const headers = new Headers(response.headers);

    headers.set(runtimeProofResponseHeader, String(probe.constructions));
    headers.set(runtimeProofIsolateHeader, probe.isolateId);

    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  },
};
