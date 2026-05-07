import { existsSync } from "node:fs";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildAirportPipeline,
  buildAirportPipelineFromFiles,
  defaultPreliminaryCuratedAirportExportPath,
  getRunwayCapabilities,
  loadCuratedAirportExportFile,
  loadRawAirportSourceFile,
  validateCuratedAirportExport,
  validateRawAirportSource
} from "./airportPipeline";

const rawAirportFixture = {
  KAAA: {
    icao: "KAAA",
    iata: "AAA",
    name: "Sample Regional Airport",
    city: "Sample City",
    state: "Iowa",
    country: "US",
    elevation: 812,
    lat: 42.1,
    lon: -93.2,
    tz: "America/Chicago"
  },
  KBBB: {
    icao: "KBBB",
    iata: "BBB",
    name: "Sample Deferred Airport",
    city: "Deferred City",
    state: "Iowa",
    country: "US",
    elevation: 950,
    lat: 42.5,
    lon: -93.5,
    tz: "America/Chicago"
  },
  KCCC: {
    icao: "KCCC",
    iata: "CCC",
    name: "Sample Excluded Heliport",
    city: "Excluded City",
    state: "Iowa",
    country: "US",
    elevation: 900,
    lat: 42.8,
    lon: -93.8,
    tz: "America/Chicago"
  },
  KDDD: {
    icao: "KDDD",
    iata: "DDD",
    name: "Sample Unreviewed Airport",
    city: "Unreviewed City",
    state: "Iowa",
    country: "US",
    elevation: 700,
    lat: 43,
    lon: -94,
    tz: "America/Chicago"
  }
};

const reviewedCuratedRecord = {
  airportScale: "regional",
  airportUseType: "public",
  hasCommercialService: true,
  hasInternationalService: false,
  isCargoRelevant: false,
  isMilitary: false,
  runwayClass: "large",
  terrainContext: "flat",
  remoteness: "small_city",
  marketArea: "Sample City",
  notes: "Sample fixture, not real curation.",
  researchUrls: ["https://example.test/airport"],
  curationStatus: "reviewed",
  lastReviewedAt: "2026-05-06T12:00:00.000Z"
} as const;

const curatedAirportFixture = {
  KAAA: reviewedCuratedRecord,
  KBBB: {
    ...reviewedCuratedRecord,
    airportScale: "community",
    hasCommercialService: false,
    runwayClass: "medium",
    curationStatus: "deferred",
    deferReason: "Not in current region focus."
  },
  KCCC: {
    ...reviewedCuratedRecord,
    airportScale: "airstrip",
    airportUseType: "heliport",
    hasCommercialService: false,
    runwayClass: "tiny",
    curationStatus: "excluded",
    excludedReason: "Heliport."
  }
} as const;

const preliminaryCuratedAirportFixture = {
  KAAA: {
    id: "airport:kaaa",
    icao: "KAAA",
    iata: "AAA",
    name: "Sample Regional Airport",
    city: "Sample City",
    state: "Iowa",
    country: "US",
    elevationFeet: 812,
    latitude: 42.1,
    longitude: -93.2,
    timezone: "America/Chicago",
    airportClass: "community",
    startingAirportEligible: true,
    localDemandRating: 35,
    businessDemandRating: 29,
    leisureDemandRating: 35,
    hubPotential: 35,
    gateCapacity: 1,
    slotPressure: 15,
    feeLevel: 23,
    commercialViability: 25,
    runwayClass: "regional",
    partnerPresence: 10,
    competitorPresence: 20,
    region: "Iowa",
    marketGroup: "Sample City",
    notes:
      "Curated via local airport curator. Use type: municipal. Terrain: flat. Remoteness: small_city.",
    manualOverrides: ["local-airport-curator"]
  }
} as const;

describe("airport data pipeline", () => {
  it("loads and validates raw airport fixtures from the real raw source shape", () => {
    const result = validateRawAirportSource(rawAirportFixture);

    expect(result.diagnostics).toEqual([]);
    expect(result.airports.KAAA).toEqual(
      expect.objectContaining({
        icao: "KAAA",
        iata: "AAA",
        elevationFeet: 812,
        latitude: 42.1,
        longitude: -93.2,
        timezone: "America/Chicago"
      })
    );
  });

  it("loads raw airport fixtures from disk and normalizes them", async () => {
    const fixturePath = join(
      await mkdtemp(join(tmpdir(), "airport-pipeline-")),
      "raw-airports.json"
    );
    await writeFile(fixturePath, `${JSON.stringify(rawAirportFixture, null, 2)}\n`, "utf8");

    const rawAirports = await loadRawAirportSourceFile(fixturePath);

    expect(rawAirports.KAAA?.name).toBe("Sample Regional Airport");
  });

  it("loads and validates curated airport fixtures", () => {
    const result = validateCuratedAirportExport(curatedAirportFixture);

    expect(result.diagnostics).toEqual([]);
    expect(result.airports.KAAA?.airportScale).toBe("regional");
    expect(result.airports.KAAA?.researchUrls).toEqual(["https://example.test/airport"]);
  });

  it("loads preliminary curated airport fixtures from the development export shape", async () => {
    const fixturePath = join(await mkdtemp(join(tmpdir(), "airport-pipeline-")), "airports.json");
    await writeFile(
      fixturePath,
      `${JSON.stringify(preliminaryCuratedAirportFixture, null, 2)}\n`,
      "utf8"
    );

    const result = await loadCuratedAirportExportFile(fixturePath);

    expect(result.missing).toBe(false);
    expect(result.diagnostics).toEqual([]);
    expect(result.airports.KAAA).toEqual(
      expect.objectContaining({
        airportScale: "community",
        airportUseType: "municipal",
        runwayClass: "medium",
        terrainContext: "flat",
        remoteness: "small_city",
        marketArea: "Sample City",
        curationStatus: "partial"
      })
    );
  });

  it("produces diagnostics for invalid curated enum values", () => {
    const result = validateCuratedAirportExport({
      KAAA: {
        ...reviewedCuratedRecord,
        runwayClass: "jumbo"
      }
    });

    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "KAAA",
        field: "runwayClass",
        message: expect.stringContaining("invalid enum value")
      })
    ]);
  });

  it("merges raw and curated data into app-ready airport records", () => {
    const result = buildAirportPipeline(rawAirportFixture, curatedAirportFixture);

    expect(result.airports).toHaveLength(1);
    expect(result.airports[0]).toEqual(
      expect.objectContaining({
        id: "airport:kaaa",
        icao: "KAAA",
        city: "Sample City",
        flags: expect.objectContaining({
          isPlayable: true,
          isReviewed: true,
          isCommercialPassengerAirport: true,
          supportsRegionalAircraft: true,
          supportsHeavyAircraft: false
        }),
        curated: expect.objectContaining({
          airportScale: "regional",
          marketArea: "Sample City"
        })
      })
    );
    expect(result.diagnostics.rawAirportCount).toBe(4);
    expect(result.diagnostics.curatedAirportCount).toBe(3);
    expect(result.diagnostics.appReadyAirportCount).toBe(1);
  });

  it("sanitizes raw airport identifiers into stable app IDs", () => {
    const result = buildAirportPipeline(
      {
        EK_2: {
          icao: "EK_2",
          iata: "",
          name: "Sample Underscore Airport",
          city: "Sample",
          country: "DK",
          elevation: 10,
          lat: 55,
          lon: 12,
          tz: "Europe/Copenhagen"
        }
      },
      {
        EK_2: reviewedCuratedRecord
      }
    );

    expect(result.airports[0]?.id).toBe("airport:ek-2");
    expect(result.diagnostics.duplicateAirportIds).toEqual([]);
  });

  it("filters excluded airports by default", () => {
    const result = buildAirportPipeline(rawAirportFixture, curatedAirportFixture);

    expect(result.diagnostics.excludedCount).toBe(1);
    expect(result.airports.some((airport) => airport.icao === "KCCC")).toBe(false);
    expect(result.diagnostics.airportsSkippedDueToStatus).toContainEqual(
      expect.objectContaining({ code: "KCCC", status: "excluded" })
    );
  });

  it("filters deferred airports by default and includes them only when requested", () => {
    const defaultResult = buildAirportPipeline(rawAirportFixture, curatedAirportFixture);
    const withDeferred = buildAirportPipeline(rawAirportFixture, curatedAirportFixture, {
      includeDeferred: true
    });

    expect(defaultResult.diagnostics.deferredCount).toBe(1);
    expect(defaultResult.airports.some((airport) => airport.icao === "KBBB")).toBe(false);
    expect(withDeferred.airports.some((airport) => airport.icao === "KBBB")).toBe(true);
  });

  it("keeps partial and unreviewed airports out by default", () => {
    const result = buildAirportPipeline(rawAirportFixture, {
      KAAA: {
        airportScale: "regional",
        curationStatus: "partial"
      }
    });

    expect(result.airports).toHaveLength(0);
    expect(result.diagnostics.airportsSkippedDueToStatus).toContainEqual(
      expect.objectContaining({ code: "KAAA", status: "partial" })
    );
    expect(result.diagnostics.airportsSkippedDueToStatus).toContainEqual(
      expect.objectContaining({ code: "KDDD", status: "unreviewed" })
    );
  });

  it("derives runway capability helpers conservatively", () => {
    expect(getRunwayCapabilities("tiny")).toEqual(
      expect.objectContaining({
        supportsFounderAircraft: true,
        supportsCommuterAircraft: false,
        supportsRegionalAircraft: false,
        supportsHeavyAircraft: false
      })
    );
    expect(getRunwayCapabilities("medium")).toEqual(
      expect.objectContaining({
        supportsFounderAircraft: true,
        supportsCommuterAircraft: true,
        supportsRegionalAircraft: true,
        supportsHeavyAircraft: false
      })
    );
    expect(getRunwayCapabilities("heavy")).toEqual(
      expect.objectContaining({
        supportsFounderAircraft: true,
        supportsCommuterAircraft: true,
        supportsRegionalAircraft: true,
        supportsHeavyAircraft: true
      })
    );
  });

  it("handles missing curated files gracefully", async () => {
    const missingPath = join(
      await mkdtemp(join(tmpdir(), "airport-pipeline-")),
      "missing-reviewed-airports.json"
    );

    const result = await loadCuratedAirportExportFile(missingPath);

    expect(result.missing).toBe(true);
    expect(result.airports).toEqual({});
    expect(result.diagnostics).toEqual([]);
  });

  it("reports useful diagnostics for missing raw airports and missing reviewed fields", () => {
    const result = buildAirportPipeline(rawAirportFixture, {
      KAAA: {
        ...reviewedCuratedRecord,
        marketArea: undefined
      },
      KZZZ: reviewedCuratedRecord
    });

    expect(result.diagnostics.missingRawAirportForCuratedRecord).toEqual(["KZZZ"]);
    expect(result.diagnostics.missingRequiredCuratedFields).toContainEqual(
      expect.objectContaining({
        code: "KAAA",
        field: "marketArea"
      })
    );
    expect(result.airports).toHaveLength(0);
  });

  it("builds the pipeline from files and marks missing curated export diagnostics", async () => {
    const dir = await mkdtemp(join(tmpdir(), "airport-pipeline-"));
    const rawPath = join(dir, "raw-airports.json");
    const missingCuratedPath = join(dir, "airports.us.reviewed.json");
    await writeFile(rawPath, `${JSON.stringify(rawAirportFixture, null, 2)}\n`, "utf8");

    const result = await buildAirportPipelineFromFiles(rawPath, missingCuratedPath);

    expect(result.diagnostics.rawAirportCount).toBe(4);
    expect(result.diagnostics.curatedAirportCount).toBe(0);
    expect(result.diagnostics.appReadyAirportCount).toBe(0);
    expect(result.diagnostics.missingCuratedFile).toBe(true);
  });

  const maybeIt = existsSync(defaultPreliminaryCuratedAirportExportPath) ? it : it.skip;

  maybeIt("validates the current preliminary curated airport file when present", async () => {
    const result = await loadCuratedAirportExportFile(defaultPreliminaryCuratedAirportExportPath);

    expect(result.missing).toBe(false);
    expect(result.diagnostics).toEqual([]);
    expect(Object.keys(result.airports).length).toBeGreaterThan(0);
  });
});
