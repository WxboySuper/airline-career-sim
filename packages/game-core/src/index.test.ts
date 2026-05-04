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

  it("reports missing activeTrackedObjectiveId", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      airline: {
        ...parsedSave.airline,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activeTrackedObjectiveId: "objective:missing" as any
      }
    };

    expect(validateSaveGameRelationships(brokenSave)).toContainEqual({
      path: "airline.activeTrackedObjectiveId",
      message: "Airline active tracked objective must exist in save objectives."
    });
  });

  it("reports missing partnerContractId in aircraft ownership", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const aircraftId = parsedSave.aircraft[0].id;
    const brokenSave = {
      ...parsedSave,
      aircraft: parsedSave.aircraft.map((a) =>
        a.id === aircraftId
          ? {
              ...a,
              ownership: {
                ...a.ownership,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                partnerContractId: "contract:missing" as any
              }
            }
          : a
      )
    };

    expect(validateSaveGameRelationships(brokenSave)).toContainEqual({
      path: `aircraft.${aircraftId}.ownership.partnerContractId`,
      message: "Aircraft ownership partner contract must exist."
    });
  });

  it("reports missing knownAirportIds", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      knownAirportIds: ["airport:missing" as any]
    };

    expect(validateSaveGameRelationships(brokenSave)).toContainEqual({
      path: "knownAirportIds",
      message: "Known airport reference is missing: airport:missing"
    });
  });
});
