import { describe, expect, it } from "vitest";

import { aircraftTypes, sampleSaveGame } from "@airline-career-sim/game-data";
import {
  acquisitionOptionSchema,
  saveGameSchema,
  type AircraftInstanceId,
  type AircraftManufacturerId,
  type AircraftTypeId,
  type AirportId,
  type ContractId,
  type ObjectiveId
} from "@airline-career-sim/shared";

import {
  compareAircraftInSameCategory,
  createAircraftInstanceFromAcquisition,
  createLeasedAircraftInstance,
  createStartingAircraftInstance,
  createUsedAircraftInstance,
  findAircraftById,
  isAircraftAllowedForAct1,
  isRunwayCompatible,
  listAircraftByCategory,
  listAircraftByManufacturer,
  listStarterAircraft,
  simulationModuleStatus,
  validateSaveGameRelationships
} from "./index";

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
        routeIds: ["route:missing" as never]
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
        activeTrackedObjectiveId: "objective:missing" as ObjectiveId
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
                partnerContractId: "contract:missing" as ContractId
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

  it("reports missing knownAirportIds and unlockedAirportIds", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      knownAirportIds: ["airport:missing" as AirportId],
      unlockedAirportIds: ["airport:missing2" as AirportId]
    };

    expect(validateSaveGameRelationships(brokenSave)).toContainEqual({
      path: "knownAirportIds",
      message: "Known airport reference is missing: airport:missing"
    });
    expect(validateSaveGameRelationships(brokenSave)).toContainEqual({
      path: "unlockedAirportIds",
      message: "Unlocked airport reference is missing: airport:missing2"
    });
  });

  it("reports missing references in contracts and requirements", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      contracts: [
        {
          ...parsedSave.contracts[0],
          relatedRouteId: "route:missing" as never,
          trackableObjectiveId: "objective:missing" as ObjectiveId,
          relatedAirportIds: ["airport:missing" as AirportId],
          requirements: [
            {
              ...parsedSave.contracts[0].requirements[0],
              routeId: "route:missing" as never,
              airportIds: ["airport:missing" as AirportId]
            }
          ]
        }
      ],
      objectiveProgress: [
        {
          ...parsedSave.objectiveProgress[0],
          objectiveId: "objective:missing" as ObjectiveId
        }
      ]
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Contract route must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Contract trackable objective must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Contract related airport reference is missing: airport:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Contract requirement route reference is missing: route:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Contract requirement airport reference is missing: airport:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Objective progress target must exist." })
    );
  });

  it("reports missing references in inbox messages and reports", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      inboxMessages: [
        {
          ...parsedSave.inboxMessages[0],
          relatedObjectiveId: "objective:missing" as ObjectiveId,
          relatedContractId: "contract:missing" as ContractId,
          relatedRouteId: "route:missing" as never,
          relatedAircraftId: "aircraft:missing" as AircraftInstanceId,
          rewardUnlockId: "unlock:missing" as never
        }
      ],
      reports: [
        {
          ...parsedSave.reports[0],
          id: "report:test" as never,
          aircraftConditionChanges: [
            {
              aircraftId: "aircraft:missing" as AircraftInstanceId,
              conditionBefore: 100,
              conditionAfter: 90
            }
          ]
        }
      ]
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Inbox message objective must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Inbox message contract must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Inbox message route must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Inbox message aircraft must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Inbox message reward unlock must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Report aircraft reference is missing: aircraft:missing" })
    );
  });

  it("reports missing references in finance state transaction history", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      aircraft: [
        {
          ...parsedSave.aircraft[0],
          ownership: {
            ...parsedSave.aircraft[0]!.ownership,
            partnerContractId: "contract:missing" as ContractId
          }
        } as never
      ]
    };

    const issues = validateSaveGameRelationships(brokenSave as never);
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Aircraft ownership partner contract must exist." })
    );
  });

  it("reports missing references in finance state transaction history", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      financeState: {
        ...parsedSave.financeState,
        transactionHistory: [
          {
            id: "tx:1",
            amount: 100,
            date: "2026-05-04T08:00:00.000-05:00",
            category: "other",
            description: "Test",
            relatedAircraftId: "aircraft:missing" as AircraftInstanceId,
            relatedContractId: "contract:missing" as ContractId,
            relatedRouteId: "route:missing" as never
          }
        ]
      }
    };

    const issues = validateSaveGameRelationships(brokenSave as never);
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Finance state transaction aircraft must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Finance state transaction contract must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Finance state transaction route must exist." })
    );
  });

  it("reports missing references in objective state progress and completed", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      objectiveState: {
        ...parsedSave.objectiveState,
        activeObjectiveIds: ["objective:missing" as ObjectiveId],
        completedObjectiveIds: ["objective:missing" as ObjectiveId],
        objectiveProgressIds: ["objective-progress:missing" as never]
      }
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Objective state active objective reference is missing: objective:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Objective state completed objective reference is missing: objective:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Objective state progress reference is missing: objective-progress:missing"
      })
    );
  });

  it("reports missing references in routes, schedules, and flights", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      routes: [
        {
          ...parsedSave.routes[0],
          originAirportId: "airport:missing" as AirportId,
          destinationAirportId: "airport:missing" as AirportId,
          assignedScheduleIds: ["schedule:missing" as never],
          relatedContractIds: ["contract:missing" as ContractId]
        }
      ],
      schedules: [
        {
          ...parsedSave.schedules[0],
          aircraftInstanceId: "aircraft:missing" as AircraftInstanceId,
          baseAirportId: "airport:missing" as AirportId,
          flights: [
            {
              ...parsedSave.schedules[0].flights[0],
              routeId: "route:missing" as never,
              aircraftInstanceId: "aircraft:missing" as AircraftInstanceId
            }
          ]
        }
      ]
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Route origin airport must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Route destination airport must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Route schedule reference is missing: schedule:missing" })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Route related contract reference is missing: contract:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Schedule aircraft must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Schedule base airport must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Scheduled flight route must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Scheduled flight aircraft must exist." })
    );
  });

  it("reports missing references in airline collections and aircraft entities", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      airline: {
        ...parsedSave.airline,
        contractIds: ["contract:missing" as ContractId],
        objectiveProgressIds: ["objective-progress:missing" as never],
        featureUnlocks: ["unlock:missing" as never]
      },
      aircraftTypes: [
        {
          ...parsedSave.aircraftTypes[0],
          manufacturerId: "manufacturer:missing" as AircraftManufacturerId
        }
      ],
      aircraft: [
        {
          ...parsedSave.aircraft[0],
          aircraftTypeId: "aircraft-type:missing" as AircraftTypeId,
          assignedBase: "airport:missing" as AirportId,
          assignedScheduleId: "schedule:missing" as never
        }
      ]
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Airline contract reference is missing: contract:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Airline objective progress reference is missing: objective-progress:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Airline unlock reference is missing: unlock:missing" })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Aircraft type manufacturer must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Aircraft instance type must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Aircraft assigned base must exist." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Aircraft assigned schedule must exist." })
    );
  });

  it("reports missing restricted contract ID on aircraft ownership and instance", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      aircraft: [
        {
          ...parsedSave.aircraft[0],
          ownership: {
            ...parsedSave.aircraft[0]!.ownership,
            restrictedToContractIds: ["contract:missing" as ContractId]
          },
          contractRestrictions: ["contract:missing" as ContractId]
        } as never
      ]
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Aircraft ownership contract restriction is missing: contract:missing"
      })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        message: "Aircraft contract restriction is missing: contract:missing"
      })
    );
  });

  it("reports missing home airport and tracked objective", () => {
    const parsedSave = saveGameSchema.parse(sampleSaveGame);
    const brokenSave = {
      ...parsedSave,
      trackedObjectiveId: "objective:missing" as ObjectiveId,
      airline: {
        ...parsedSave.airline,
        homeAirportId: "airport:missing" as AirportId
      }
    };

    const issues = validateSaveGameRelationships(brokenSave);
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Airline home airport must exist in save airports." })
    );
    expect(issues).toContainEqual(
      expect.objectContaining({ message: "Tracked objective must exist in save objectives." })
    );
  });

  it("finds and filters aircraft catalog entries", () => {
    expect(
      findAircraftById(aircraftTypes, "aircraft-type:aster-a8-courier" as AircraftTypeId)?.name
    ).toBe("Aster A-8 Courier");
    expect(
      listAircraftByCategory(aircraftTypes, "founder").map((aircraft) => aircraft.name)
    ).toEqual(["Aster A-8 Courier", "Kestrel K-10 Trail"]);
    expect(
      listAircraftByManufacturer(
        aircraftTypes,
        "manufacturer:hawthorne" as AircraftManufacturerId
      ).map((aircraft) => aircraft.name)
    ).toEqual(["Hawthorne H-56 Connector", "Hawthorne HJ-48 Link", "Hawthorne HJ-72 Bridge"]);
  });

  it("lists only the two Act 1 starter aircraft", () => {
    expect(listStarterAircraft(aircraftTypes).map((aircraft) => aircraft.name)).toEqual([
      "Aster A-8 Courier",
      "Kestrel K-10 Trail"
    ]);
  });

  it("keeps both starter choices viable with distinct tradeoffs", () => {
    const [aster, kestrel] = listStarterAircraft(aircraftTypes);

    expect(aster.purchasePrice).toBeLessThan(kestrel.purchasePrice);
    expect(aster.monthlyLeasePrice).toBeLessThan(kestrel.monthlyLeasePrice);
    expect(kestrel.reliabilityRating).toBeGreaterThan(aster.reliabilityRating);
    expect(kestrel.maintenanceCostRating).toBeGreaterThan(aster.maintenanceCostRating);
    expect(kestrel.airportRunwayRequirement).toBe("short");
  });

  it("compares aircraft in the same category", () => {
    const comparison = compareAircraftInSameCategory(aircraftTypes, "small-regional-jet");

    expect(comparison).toEqual([
      expect.objectContaining({
        aircraftTypeId: "aircraft-type:aster-aj44-swift",
        capacity: 44,
        purchasePrice: 12300000
      }),
      expect.objectContaining({
        aircraftTypeId: "aircraft-type:hawthorne-hj48-link",
        capacity: 48,
        comfortRating: 78
      })
    ]);
  });

  it("checks Act 1 aircraft allowance and runway compatibility", () => {
    const starter = findAircraftById(
      aircraftTypes,
      "aircraft-type:kestrel-k10-trail" as AircraftTypeId
    );
    const jet = findAircraftById(
      aircraftTypes,
      "aircraft-type:hawthorne-hj72-bridge" as AircraftTypeId
    );

    expect(starter && isAircraftAllowedForAct1(starter)).toBe(true);
    expect(jet && isAircraftAllowedForAct1(jet)).toBe(false);
    expect(starter && isRunwayCompatible(starter, "short")).toBe(true);
    expect(jet && isRunwayCompatible(jet, "regional")).toBe(false);
    expect(jet && isRunwayCompatible(jet, "mainline")).toBe(true);
  });

  it("creates a deterministic starting aircraft instance", () => {
    const aster = findAircraftById(
      aircraftTypes,
      "aircraft-type:aster-a8-courier" as AircraftTypeId
    );
    if (!aster) {
      throw new Error("Aster A-8 Courier not found in catalog");
    }

    const instance = createStartingAircraftInstance(aster, {
      id: "aircraft:nc101as" as AircraftInstanceId,
      registration: "NC-101AS",
      assignedBase: "airport:kalo" as AirportId
    });

    expect(instance).toMatchObject({
      aircraftTypeId: "aircraft-type:aster-a8-courier",
      condition: 78,
      reliabilityModifier: -5,
      monthlyPayment: 0,
      ownership: {
        acquisitionType: "starting-aircraft",
        legalOwner: "player-airline",
        operationalControl: "player-airline",
        canBeRetainedAfterSeparation: true
      }
    });
  });

  it("applies used purchase condition and reliability penalties", () => {
    const kestrel = findAircraftById(
      aircraftTypes,
      "aircraft-type:kestrel-k19-harbor" as AircraftTypeId
    );
    if (!kestrel) {
      throw new Error("Kestrel K-19 Harbor not found in catalog");
    }

    const instance = createUsedAircraftInstance(kestrel, {
      id: "aircraft:nc219kh" as AircraftInstanceId,
      registration: "NC-219KH",
      assignedBase: "airport:kalo" as AirportId,
      ageYears: 16,
      flightHours: 7200,
      cycles: 4800,
      condition: 70,
      cabinCondition: 64
    });

    expect(instance.condition).toBe(70);
    expect(instance.cabinCondition).toBe(64);
    expect(instance.reliabilityModifier).toBeLessThan(0);
    expect(instance.residualValue).toBeLessThan(kestrel.purchasePrice);
    expect(instance.ownership.acquisitionType).toBe("used-purchase");
  });

  it("caps reliability penalty at -35 for very old/damaged aircraft", () => {
    const kestrel = findAircraftById(
      aircraftTypes,
      "aircraft-type:kestrel-k19-harbor" as AircraftTypeId
    );
    if (!kestrel) {
      throw new Error("Kestrel K-19 Harbor not found in catalog");
    }
    const instance = createUsedAircraftInstance(kestrel, {
      id: "aircraft:old" as AircraftInstanceId,
      registration: "N-OLD",
      assignedBase: "airport:kalo" as AirportId,
      ageYears: 100,
      flightHours: 100000,
      cycles: 80000,
      condition: 0,
      cabinCondition: 0
    });

    expect(instance.reliabilityModifier).toBe(-35);
  });

  it("creates leased aircraft instances", () => {
    const hawthorne = findAircraftById(
      aircraftTypes,
      "aircraft-type:hawthorne-h56-connector" as AircraftTypeId
    );
    if (!hawthorne) {
      throw new Error("Hawthorne H-56 Connector not found in catalog");
    }

    const instance = createLeasedAircraftInstance(hawthorne, {
      id: "aircraft:nc556hc" as AircraftInstanceId,
      registration: "NC-556HC",
      assignedBase: "airport:kalo" as AirportId
    });

    expect(instance.monthlyPayment).toBe(hawthorne.monthlyLeasePrice);
    expect(instance.ownership).toMatchObject({
      acquisitionType: "operating-lease",
      legalOwner: "lessor",
      paymentResponsibleParty: "player-airline",
      mustReturnOnSeparation: true
    });
  });

  it("creates wet-lease and finance-lease aircraft instances", () => {
    const kestrel = findAircraftById(
      aircraftTypes,
      "aircraft-type:kestrel-k32-range" as AircraftTypeId
    );
    if (!kestrel) {
      throw new Error("Kestrel K-32 Range not found in catalog");
    }

    const wetLease = createLeasedAircraftInstance(
      kestrel,
      {
        id: "aircraft:wet" as AircraftInstanceId,
        registration: "N-WET",
        assignedBase: "airport:kalo" as AirportId
      },
      "wet-lease"
    );
    expect(wetLease.monthlyPayment).toBeGreaterThan(kestrel.monthlyLeasePrice);
    expect(wetLease.ownership.acquisitionType).toBe("wet-lease");

    const financeLease = createLeasedAircraftInstance(
      kestrel,
      {
        id: "aircraft:finance" as AircraftInstanceId,
        registration: "N-FIN",
        assignedBase: "airport:kalo" as AirportId
      },
      "finance-lease"
    );
    expect(financeLease.ownership.legalOwner).toBe("player-airline");
    expect(financeLease.ownership.canBeRetainedAfterSeparation).toBe(true);
  });

  it("validates acquisition options and partner-connected ownership metadata", () => {
    const aircraftType = findAircraftById(
      aircraftTypes,
      "aircraft-type:hawthorne-hj72-bridge" as AircraftTypeId
    );
    if (!aircraftType) {
      throw new Error("Hawthorne HJ-72 Bridge not found in catalog");
    }

    const option = acquisitionOptionSchema.parse({
      acquisitionType: "partner-financed",
      upfrontCost: 250000,
      monthlyPayment: 165000,
      deliveryTimeDays: 45,
      condition: 94,
      cabinCondition: 91,
      reliabilityModifier: 3,
      legalOwner: "player-airline",
      paymentResponsibleParty: "shared",
      operationalControl: "shared",
      partnerId: "partner:northstar",
      partnerContractId: "contract:northstar-feed",
      restrictedToContractIds: ["contract:northstar-feed"],
      canBeRetainedAfterSeparation: true,
      buyoutPrice: 3600000,
      mustReturnOnSeparation: false
    });

    const instance = createAircraftInstanceFromAcquisition(aircraftType, option, {
      id: "aircraft:nc772pb" as AircraftInstanceId,
      registration: "NC-772PB",
      assignedBase: "airport:kalo" as AirportId
    });

    expect(instance.ownership).toMatchObject({
      acquisitionType: "partner-financed",
      legalOwner: "player-airline",
      paymentResponsibleParty: "shared",
      operationalControl: "shared",
      partnerId: "partner:northstar",
      partnerContractId: "contract:northstar-feed",
      restrictedToContractIds: ["contract:northstar-feed"],
      canBeRetainedAfterSeparation: true,
      buyoutPrice: 3600000,
      mustReturnOnSeparation: false
    });
    expect(instance.contractRestrictions).toEqual(["contract:northstar-feed"]);
  });
});
