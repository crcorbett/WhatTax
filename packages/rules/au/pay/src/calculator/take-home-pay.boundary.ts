import { Effect, Layer, Schema } from "effect";

import {
  TakeHomeScenarioInputSchema,
  TakeHomeScenarioLiveFromInput,
} from "./take-home-pay.js";

type UntrustedTakeHomeScenario = typeof Schema.Unknown.Type;

/**
 * Builds the public unknown-input scenario boundary for gross pay and
 * tax-free-threshold status.
 *
 * @param input - Unknown input decoded by `TakeHomeScenarioInputSchema`.
 * @returns A layer providing `GrossPayFact` and `TaxFreeThresholdClaimedFact`.
 * @since 0.1.0
 */
export const TakeHomeScenarioLive = (input: UntrustedTakeHomeScenario) =>
  Layer.unwrap(
    Schema.decodeUnknownEffect(TakeHomeScenarioInputSchema)(input).pipe(
      Effect.map(TakeHomeScenarioLiveFromInput)
    )
  );
