import { describe, expect, it } from "vitest";

import {
  aircraftInstanceSchema,
  productName,
  simulationPaceSchema,
} from "./index";

describe("shared package", () => {
  it("exports the product name", () => {
    expect(productName).toBe("Airline Career Simulator");
  });

  it("validates fixed simulation pace settings", () => {
    expect(
      simulationPaceSchema.parse({
        id: "standard",
        displayName: "Standard",
        realMinutesPerGameDay: 60,
        catchUpEnabled: true,
        catchUpCapGameDays: 7,
      }),
    ).toMatchObject({
      id: "standard",
      catchUpEnabled: true,
    });
  });

  it("validates aircraft ownership and partner control metadata", () => {
    const aircraft = aircraftInstanceSchema.parse({
      id: "aircraft:partner-bridge-1",
      aircraftTypeId: "aircraft-type:hawthorne-hj72-bridge",
      registration: "NC-772PB",
      ageYears: 2,
      flightHours: 1200,
      cycles: 820,
      condition: 92,
      cabinCondition: 88,
      reliabilityModifier: 4,
      maintenanceStatus: "available",
      ownership: {
        acquisitionType: "partner-financed",
        legalOwner: "player-airline",
        paymentResponsibleParty: "shared",
        operationalControl: "shared",
        partnerId: "partner:northstar",
        partnerContractId: "contract:northstar-feed",
        restrictedToContractIds: ["contract:northstar-feed"],
        canBeRetainedAfterSeparation: true,
        buyoutPrice: 1800000,
        mustReturnOnSeparation: false,
      },
      monthlyPayment: 42000,
      residualValue: 2400000,
      assignedBase: "airport:kalo",
      contractRestrictions: ["contract:northstar-feed"],
    });

    expect(aircraft.ownership.acquisitionType).toBe("partner-financed");
    expect(aircraft.ownership.canBeRetainedAfterSeparation).toBe(true);
  });
});

