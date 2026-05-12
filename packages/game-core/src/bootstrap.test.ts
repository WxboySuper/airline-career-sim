import { describe, expect, it } from "vitest";

import { aircraftTypes, starterAirports } from "@airline-career-sim/game-data";
import { saveGameSchema } from "@airline-career-sim/shared";

import {
  createNewAirlineSave,
  validateSaveGameRelationships,
  validateStarterAirportEligibility,
  validateStarterAircraftEligibility
} from "./index";
const baseOptions = {
  userId: "user:local-founder" as const,
  airlineName: "Cedar Valley Air",
  airlineCode: "CVA",
  founderName: "Local Founder",
  starterAirportId: starterAirports[0]?.id,
  starterAircraftTypeId: aircraftTypes.find((aircraftType) => aircraftType.starterAircraft)?.id,
  simulationPaceId: "standard" as const,
  difficulty: "standard" as const,
  createdAt: "2026-05-04T08:00:00.000-05:00",
  currentGameTime: "2026-05-04T08:00:00.000-05:00"
};

describe("airline save bootstrap", () => {
  it("creates a fully validated new airline save", () => {
    const save = createNewAirlineSave(baseOptions);
    const parsed = saveGameSchema.parse(save);

    expect(validateSaveGameRelationships(parsed)).toEqual([]);
    expect(parsed.airline.name).toBe("Cedar Valley Air");
    expect(parsed.aircraft).toHaveLength(1);
    expect(parsed.routes).toHaveLength(0);
    expect(parsed.schedules).toHaveLength(0);
    expect(parsed.contracts).toHaveLength(0);
    expect(parsed.inboxMessages).toHaveLength(2);
    expect(parsed.objectiveState.activeObjectiveIds).toEqual(["objective:choose-first-route"]);
    expect(parsed.storyState.currentAct).toBe("act1");
    expect(parsed.airline.featureUnlocks).toEqual([
      "unlock:basic-dashboard",
      "unlock:inbox",
      "unlock:simplified-route-planning",
      "unlock:simplified-schedule-board",
      "unlock:pause-resume-controls"
    ]);
    expect(parsed.featureUnlocks.map((unlock) => unlock.id)).toContain(
      "unlock:commuter-certification-path"
    );
    expect(parsed.financeState.currentCash).toBe(125000);
    expect(parsed.simulationConfig.paused).toBe(true);
  });

  it("validates starter airports and aircraft", () => {
    const starterAirport = starterAirports[0];
    if (!starterAirport) {
      throw new Error("No starter airport was exported from game-data.");
    }

    const starterAircraftType = aircraftTypes.find((aircraftType) => aircraftType.starterAircraft);
    if (!starterAircraftType) {
      throw new Error("No starter aircraft was exported from game-data.");
    }

    expect(validateStarterAirportEligibility(starterAirport)).toEqual([]);
    expect(validateStarterAircraftEligibility(starterAircraftType, starterAirport)).toEqual([]);
  });

  it("applies difficulty modifiers to the bootstrap state", () => {
    const easy = createNewAirlineSave({
      ...baseOptions,
      difficulty: "easy"
    });
    const hard = createNewAirlineSave({
      ...baseOptions,
      difficulty: "hard"
    });

    expect(easy.financeState.currentCash).toBeGreaterThan(hard.financeState.currentCash);
    expect(easy.financeState.maintenanceReserve).toBeGreaterThan(
      hard.financeState.maintenanceReserve
    );
    expect(easy.airline.reputation).toBeGreaterThan(hard.airline.reputation);
    expect(easy.aircraft[0].reliabilityModifier).toBeGreaterThan(
      hard.aircraft[0].reliabilityModifier
    );
  });

  it("uses stable simulation config defaults", () => {
    const save = createNewAirlineSave(baseOptions);

    expect(save.simulationConfig).toMatchObject({
      simulationPaceId: "standard",
      difficulty: "standard",
      createdAt: "2026-05-04T08:00:00.000-05:00",
      lastPlayedAt: "2026-05-04T08:00:00.000-05:00",
      currentGameTime: "2026-05-04T08:00:00.000-05:00",
      paused: true
    });
  });

  it("generates inbox, objective, and story bootstrap state", () => {
    const save = createNewAirlineSave(baseOptions);

    expect(save.inboxMessages.map((message) => message.sender)).toEqual([
      "Maya Reyes",
      "Maya Reyes"
    ]);
    expect(save.inboxMessages.every((message) => message.read === false)).toBe(true);
    expect(save.inboxState.messageIds).toEqual(save.inboxMessages.map((message) => message.id));
    expect(save.inboxMessages.map((message) => message.id)).toEqual([
      "message:cedar-valley-air-kalo-maya-welcome-setup",
      "message:cedar-valley-air-kalo-maya-first-route-guidance"
    ]);
    expect(save.objectiveState.trackedObjectiveId).toBe("objective:choose-first-route");
    expect(save.objectiveState.activeObjectiveIds).toEqual(["objective:choose-first-route"]);
    expect(save.objectiveState.objectiveProgressIds).toEqual([
      "objective-progress:choose-first-route"
    ]);
    expect(save.storyState.flags).toContain("act1-started");
    expect(save.storyState.currentChapter).toBe("founder-operator");
  });

  it("is deterministic for the same inputs", () => {
    const first = createNewAirlineSave(baseOptions);
    const second = createNewAirlineSave(baseOptions);

    expect(second).toEqual(first);
  });

  it("rejects an invalid starter airport", () => {
    expect(() =>
      createNewAirlineSave({
        ...baseOptions,
        starterAirportId: "airport:missing" as never
      })
    ).toThrow("Starter airport not found: airport:missing");
  });

  it("rejects an invalid starter aircraft", () => {
    expect(() =>
      createNewAirlineSave({
        ...baseOptions,
        starterAircraftTypeId: "aircraft-type:hawthorne-hj72-bridge" as never
      })
    ).toThrow("Starter aircraft must be flagged as starter aircraft.");
  });

  it("reports invalid starter helper inputs directly", () => {
    const starterAirport = starterAirports[0];
    const starterAircraftType = aircraftTypes.find((aircraftType) => aircraftType.starterAircraft);

    if (!starterAirport || !starterAircraftType) {
      throw new Error("Starter fixtures are unavailable.");
    }

    const invalidAirport = {
      ...starterAirport,
      flags: {
        ...starterAirport.flags,
        startingAirportEligible: false
      }
    };

    const invalidAircraft = {
      ...starterAircraftType,
      starterAircraft: false
    };

    expect(validateStarterAirportEligibility(invalidAirport)).toContainEqual(
      expect.objectContaining({
        message: "Starter airport must be marked starter-airport-eligible."
      })
    );
    expect(validateStarterAircraftEligibility(invalidAircraft, starterAirport)).toContainEqual(
      expect.objectContaining({
        message: "Starter aircraft must be flagged as starter aircraft."
      })
    );
  });

  it("reports other starter airport eligibility issues", () => {
    const starterAirport = starterAirports[0] as NonNullable<(typeof starterAirports)[0]>;

    expect(
      validateStarterAirportEligibility({
        ...starterAirport,
        flags: { ...starterAirport.flags, supportsFounderAircraft: false }
      })
    ).toContainEqual(
      expect.objectContaining({ message: "Starter airport must support founder aircraft." })
    );

    expect(
      validateStarterAirportEligibility({
        ...starterAirport,
        flags: { ...starterAirport.flags, isExcluded: true }
      })
    ).toContainEqual(expect.objectContaining({ message: "Starter airport cannot be excluded." }));

    expect(
      validateStarterAirportEligibility({
        ...starterAirport,
        flags: { ...starterAirport.flags, isDeferred: true }
      })
    ).toContainEqual(expect.objectContaining({ message: "Starter airport cannot be deferred." }));

    expect(
      validateStarterAirportEligibility({
        ...starterAirport,
        flags: { ...starterAirport.flags, isPlayable: false }
      })
    ).toContainEqual(expect.objectContaining({ message: "Starter airport must be playable." }));
  });

  it("maps starter runway classes and checks compatibility", () => {
    const starterAircraftType = aircraftTypes.find(
      (aircraftType) => aircraftType.starterAircraft
    ) as NonNullable<(typeof aircraftTypes)[0]>;
    const starterAirport = starterAirports[0] as NonNullable<(typeof starterAirports)[0]>;

    const testRunway = (runwayClass: CuratedRunwayClass) =>
      validateStarterAircraftEligibility(starterAircraftType, {
        ...starterAirport,
        curated: { ...starterAirport.curated, runwayClass }
      });

    // Valid ones for starter aircraft (short/regional/mainline/heavy)
    // Starter aircraft requires "short", so any airport with small/medium/large/heavy is fine.
    expect(testRunway("small")).toEqual([]);
    expect(testRunway("medium")).toEqual([]);
    expect(testRunway("large")).toEqual([]);
    expect(testRunway("heavy")).toEqual([]);
    expect(testRunway("unknown")).toEqual([]); // defaults to regional
  });

  it("uses defaults when no explicit IDs are provided", () => {
    const save = createNewAirlineSave({
      userId: "user:local-founder",
      airlineName: "Cedar Valley Air",
      airlineCode: "CVA",
      founderName: "Local Founder"
    });

    expect(save.airline.homeAirportId).toBeDefined();
    expect(save.aircraft[0].aircraftTypeId).toBeDefined();
    expect(save.simulationConfig.difficulty).toBe("standard");
    expect(save.simulationConfig.simulationPaceId).toBe("standard");
  });

  it("uses defaults for difficulty and simulation pace if an unknown ID is provided", () => {
    const save = createNewAirlineSave({
      ...baseOptions,
      difficulty: "unknown-difficulty" as never,
      simulationPaceId: "unknown-pace" as never
    });

    expect(save.simulationConfig.difficulty).toBe("standard");
    expect(save.simulationConfig.simulationPaceId).toBe("standard");
  });
});
