import { describe, expect, it } from "vitest";

import {
  aircraftInstanceSchema,
  aircraftManufacturerSchema,
  aircraftTypeSchema,
  contractSchema,
  curatedAirportSchema,
  inboxMessageSchema,
  rawAirportSchema,
  saveGameSchema,
  careerObjectiveSchema,
  rawAirportEntrySchema,
} from "@airline-career-sim/shared";

import {
  sampleAircraft,
  sampleAircraftTypes,
  sampleContracts,
  sampleInboxMessages,
  sampleManufacturers,
  sampleObjectives,
  sampleSaveGame,
  curatedAirportStubs,
  rawAirportSourceStub,
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
        timezone: "America/Chicago",
      },
    };

    expect(() => rawAirportSchema.parse(representativeRawAirportSource)).not.toThrow();
    expect(rawAirportSchema.parse(representativeRawAirportSource).KALO?.icao).toBe(
      "KALO",
    );
  });

  it("validates sample data against shared schemas", () => {
    expect(() => rawAirportSchema.parse(rawAirportSourceStub)).not.toThrow();
    for (const airport of Object.values(rawAirportSourceStub)) {
      expect(() => rawAirportEntrySchema.parse(airport)).not.toThrow();
    }
    for (const airport of curatedAirportStubs) {
      expect(() => curatedAirportSchema.parse(airport)).not.toThrow();
    }
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
  });

  it("serializes and deserializes the sample save game", () => {
    const parsed = saveGameSchema.parse(sampleSaveGame);
    const roundTripped = saveGameSchema.parse(JSON.parse(JSON.stringify(parsed)));

    expect(roundTripped.id).toBe("save:cedar-valley-act1");
    expect(roundTripped.airline.name).toBe("Cedar Valley Air");
    expect(roundTripped.inboxMessages[0]?.sender).toBe("Maya Reyes");
  });
});
