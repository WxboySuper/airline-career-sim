import { describe, expect, it } from "vitest";

import { sampleSaveGame } from "@airline-career-sim/game-data";
import { saveGameSchema } from "@airline-career-sim/shared";

import { simulationModuleStatus, validateSaveGameRelationships } from "./index";

describe("game-core package", () => {
  it("keeps the foundation marker", () => {
    expect(simulationModuleStatus).toBe("foundation-ready");
  });

  it("validates relationship integrity for the sample save", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);

    expect(validateSaveGameRelationships(parsedSave)).toEqual([]);
  });

  it("reports missing save references without mutating the save", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      airline: {
        ...parsedSave.airline,
        routeIds: ["route:missing"]
      }
    };

    expect(validateSaveGameRelationships(brokenSave)).toEqual([
      {
        path: "airline.routeIds",
        message: "Airline route reference is missing: route:missing"
      }
    ]);
    expect(parsedSave.airline.routeIds).toEqual(["route:kalo-kmcw"]);
  });
});
