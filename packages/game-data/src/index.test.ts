import { describe, expect, it } from "vitest";

import {
  airlineIdentitySchema,
  difficultyPresetSchema,
  financeStateSchema,
  founderProfileSchema,
  aircraftInstanceSchema,
  aircraftManufacturerSchema,
  aircraftTypeSchema,
  contractSchema,
  curatedAirportSchema,
  inboxStateSchema,
  inboxMessageSchema,
  objectiveStateSchema,
  rawAirportSchema,
  saveGameSchema,
  careerObjectiveSchema,
  simulationConfigSchema,
  storyStateSchema,
  rawAirportEntrySchema
} from "@airline-career-sim/shared";

import {
  difficultyPresets,
  aircraftManufacturers,
  aircraftTypes,
  sampleAircraft,
  sampleAirline,
  sampleAircraftTypes,
  sampleContracts,
  sampleFinanceState,
  sampleFounderProfile,
  sampleInboxMessages,
  sampleInboxState,
  sampleObjectiveState,
  sampleManufacturers,
  sampleObjectives,
  sampleSimulationConfig,
  sampleSaveGame,
  sampleStoryState,
  sampleSaveAirports,
  starterAirports,
  rawAirportSourceStub
} from "./index";

describe("sample game data", () => {
  it("validates a representative keyed raw airport source entry", () => {
    const representativeRawAirportSource = {
      KALO: {
        icao: "KALO",
        iata: "ALO",
        name: "Waterloo Regional Airport",
        city: "Waterloo",
        state: "IA",
        country: "United States",
        elevationFeet: 873,
        latitude: 42.5571,
        longitude: -92.4003,
        timezone: "America/Chicago"
      }
    };

    expect(() => rawAirportSchema.parse(representativeRawAirportSource)).not.toThrow();
    expect(rawAirportSchema.parse(representativeRawAirportSource).KALO?.icao).toBe("KALO");
  });

  it("validates sample data against shared schemas", () => {
    expect(() => rawAirportSchema.parse(rawAirportSourceStub)).not.toThrow();
    for (const airport of Object.values(rawAirportSourceStub)) {
      expect(() => rawAirportEntrySchema.parse(airport)).not.toThrow();
    }
    expect(starterAirports[0]?.curated.runwayClass).toBe("small");
    expect(starterAirports[0]?.flags.supportsFounderAircraft).toBe(true);
    for (const airport of sampleSaveAirports) {
      expect(() => curatedAirportSchema.parse(airport)).not.toThrow();
    }
    expect(sampleSaveAirports.map((airport) => airport.runwayClass)).toEqual(["short", "short"]);
    for (const manufacturer of sampleManufacturers) {
      expect(() => aircraftManufacturerSchema.parse(manufacturer)).not.toThrow();
    }
    for (const aircraftType of sampleAircraftTypes) {
      expect(() => aircraftTypeSchema.parse(aircraftType)).not.toThrow();
    }
    for (const aircraft of sampleAircraft) {
      expect(() => aircraftInstanceSchema.parse(aircraft)).not.toThrow();
    }
    for (const contract of sampleContracts) {
      expect(() => contractSchema.parse(contract)).not.toThrow();
    }
    for (const objective of sampleObjectives) {
      expect(() => careerObjectiveSchema.parse(objective)).not.toThrow();
    }
    for (const message of sampleInboxMessages) {
      expect(() => inboxMessageSchema.parse(message)).not.toThrow();
    }
    expect(() => founderProfileSchema.parse(sampleFounderProfile)).not.toThrow();
    expect(() => airlineIdentitySchema.parse(sampleAirline)).not.toThrow();
    expect(() => simulationConfigSchema.parse(sampleSimulationConfig)).not.toThrow();
    expect(() => financeStateSchema.parse(sampleFinanceState)).not.toThrow();
    expect(() => inboxStateSchema.parse(sampleInboxState)).not.toThrow();
    expect(() => objectiveStateSchema.parse(sampleObjectiveState)).not.toThrow();
    expect(() => storyStateSchema.parse(sampleStoryState)).not.toThrow();
  });

  it("validates the manufacturer catalog", () => {
    expect(aircraftManufacturers.map((manufacturer) => manufacturer.name)).toEqual([
      "Aster Aviation",
      "Kestrel Aircraft Works",
      "Hawthorne Aeronautics",
      "Vela Aerospace"
    ]);

    for (const manufacturer of aircraftManufacturers) {
      expect(() => aircraftManufacturerSchema.parse(manufacturer)).not.toThrow();
    }
  });

  it("validates the Version 1.0 aircraft catalog", () => {
    expect(aircraftTypes.map((aircraftType) => aircraftType.name)).toEqual([
      "Aster A-8 Courier",
      "Kestrel K-10 Trail",
      "Aster A-19 Commuter",
      "Kestrel K-19 Harbor",
      "Kestrel K-32 Range",
      "Vela V-34 Nova",
      "Kestrel K-52 Mesa",
      "Hawthorne H-56 Connector",
      "Aster AJ-44 Swift",
      "Hawthorne HJ-48 Link",
      "Hawthorne HJ-72 Bridge",
      "Vela VJ-86 Arc"
    ]);

    for (const aircraftType of aircraftTypes) {
      expect(() => aircraftTypeSchema.parse(aircraftType)).not.toThrow();
    }
  });

  it("has two aircraft per early Version 1.0 category", () => {
    const categoryCounts = aircraftTypes.reduce<Record<string, number>>((counts, aircraftType) => {
      counts[aircraftType.category] = (counts[aircraftType.category] ?? 0) + 1;
      return counts;
    }, {});

    expect(categoryCounts).toMatchObject({
      founder: 2,
      commuter: 2,
      "small-regional-turboprop": 2,
      "large-regional-turboprop": 2,
      "small-regional-jet": 2,
      "large-regional-jet": 2
    });
  });

  it("represents manufacturer lore through distinct behavioral tradeoffs", () => {
    const hawthorneJet = aircraftTypes.find((a) => a.id === "aircraft-type:hawthorne-hj48-link");
    const asterJet = aircraftTypes.find((a) => a.id === "aircraft-type:aster-aj44-swift");
    const velaJet = aircraftTypes.find((a) => a.id === "aircraft-type:vela-vj86-arc");

    // Hawthorne: Premium pricing, high comfort, partner-ready
    expect(hawthorneJet?.purchasePrice).toBeGreaterThan(asterJet?.purchasePrice ?? 0);
    expect(hawthorneJet?.comfortRating).toBeGreaterThan(asterJet?.comfortRating ?? 0);
    expect(hawthorneJet?.partnerCompatibility).toBe("preferred");

    // Aster: Budget, lower comfort
    expect(asterJet?.purchasePrice).toBeLessThan(velaJet?.purchasePrice ?? 0);
    expect(asterJet?.comfortRating).toBeLessThan(velaJet?.comfortRating ?? 0);

    // Vela: Efficient, high capacity, modern
    expect(velaJet?.capacity).toBeGreaterThan(hawthorneJet?.capacity ?? 0);
    expect(velaJet?.deliveryTimeDays).toBeGreaterThan(hawthorneJet?.deliveryTimeDays ?? 0);
  });

  it("validates starter airports and difficulty presets for the bootstrap layer", () => {
    expect(starterAirports.length).toBeGreaterThan(0);
    for (const airport of starterAirports) {
      expect(airport.flags.startingAirportEligible).toBe(true);
      expect(airport.flags.supportsFounderAircraft).toBe(true);
      expect(airport.flags.isPlayable).toBe(true);
    }

    expect(difficultyPresets.map((preset) => preset.id)).toEqual([
      "easy",
      "standard",
      "hard",
      "realistic"
    ]);

    for (const preset of difficultyPresets) {
      expect(() => difficultyPresetSchema.parse(preset)).not.toThrow();
    }
  });

  it("serializes and deserializes the sample save game", () => {
    const parsed = saveGameSchema.parse(sampleSaveGame);
    const roundTripped = saveGameSchema.parse(JSON.parse(JSON.stringify(parsed)));
    const storyMessage = roundTripped.inboxMessages.find(
      (message) => message.sender === "Maya Reyes"
    );

    expect(roundTripped.id).toBe("save:cedar-valley-act1");
    expect(roundTripped.airline.name).toBe("Cedar Valley Air");
    expect(storyMessage?.sender).toBe("Maya Reyes");
    expect(roundTripped.founderProfile.name).toBe("Local Founder");
    expect(roundTripped.simulationConfig.paused).toBe(true);
  });
});
