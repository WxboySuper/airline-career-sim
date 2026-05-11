import type {
  AcquisitionOption,
  AircraftCategory,
  AircraftInstance,
  AircraftInstanceId,
  AircraftType,
  AircraftTypeId,
  AirlineIdentity,
  AirlineStatus,
  CareerObjective,
  Difficulty,
  DifficultyPreset,
  FinanceState,
  FounderProfile,
  InboxMessage,
  AirportId,
  ObjectiveId,
  ObjectiveProgress,
  ObjectiveState,
  ObjectiveProgressId,
  SaveId,
  StoryState,
  RunwayClass,
  SimulationConfig,
  SimulationPace,
  SaveGame
} from "@airline-career-sim/shared";

import { z } from "zod";
import {
  saveGameSchema,
  aircraftManufacturerSchema,
  aircraftTypeSchema,
  difficultyPresetSchema,
  inboxMessageSchema,
  careerObjectiveSchema,
  simulationPaceSchema
} from "@airline-career-sim/shared";

import {
  aircraftManufacturers as starterAircraftManufacturers,
  aircraftTypes as starterAircraftTypes,
  curatedAirportStubs as starterAirportCuratedStubs,
  difficultyPresets as starterDifficultyPresets,
  sampleInboxMessages as starterInboxTemplates,
  sampleObjectives as starterObjectives,
  sampleSaveAirports as starterSaveAirports,
  sampleSimulationPaces as starterSimulationPaces,
  starterAirports as starterAirportCatalog
} from "@airline-career-sim/game-data";

const starterAircraftManufacturersCatalog = z
  .array(aircraftManufacturerSchema)
  .parse(starterAircraftManufacturers);
const starterAircraftTypesCatalog = z.array(aircraftTypeSchema).parse(starterAircraftTypes);
const starterAirportCatalogEntries = starterAirportCatalog;
const starterDifficultyPresetCatalog = z
  .array(difficultyPresetSchema)
  .min(1)
  .parse(starterDifficultyPresets);
const starterInboxTemplateCatalog = z
  .array(inboxMessageSchema)
  .min(1)
  .parse(starterInboxTemplates);
const starterObjectiveCatalog = z.array(careerObjectiveSchema).min(1).parse(starterObjectives);
const starterSimulationPaceCatalog = z
  .array(simulationPaceSchema)
  .min(1)
  .parse(starterSimulationPaces);

export type SimulationModuleStatus = "foundation-ready";

export const simulationModuleStatus: SimulationModuleStatus = "foundation-ready";

const RUNWAY_CLASS_RANK: Record<RunwayClass, number> = {
  short: 1,
  standard: 2,
  regional: 3,
  mainline: 4,
  heavy: 5
};

type AircraftInstanceInput = {
  id: AircraftInstanceId;
  registration: string;
  assignedBase: AirportId;
};

type UsedAircraftInput = AircraftInstanceInput & {
  ageYears: number;
  flightHours: number;
  cycles: number;
  condition: number;
  cabinCondition: number;
};

export type AircraftComparison = {
  aircraftTypeId: AircraftTypeId;
  capacity: number;
  rangeNm: number;
  cruiseSpeedKtas: number;
  operatingCostRating: number;
  maintenanceCostRating: number;
  reliabilityRating: number;
  comfortRating: number;
  cargoStorageRating: number;
  purchasePrice: number;
  monthlyLeasePrice: number;
};

/**
 * Finds an aircraft type in the catalog by its ID.
 *
 * @param aircraftTypes - The full aircraft type catalog.
 * @param aircraftTypeId - The ID of the aircraft type to find.
 * @returns The aircraft type if found, otherwise undefined.
 */
export const findAircraftById = (
  aircraftTypes: readonly AircraftType[],
  aircraftTypeId: AircraftTypeId
) => aircraftTypes.find((aircraftType) => aircraftType.id === aircraftTypeId);

/**
 * Lists all aircraft types belonging to a specific category.
 *
 * @param aircraftTypes - The full aircraft type catalog.
 * @param category - The category to filter by.
 * @returns An array of matching aircraft types.
 */
export const listAircraftByCategory = (
  aircraftTypes: readonly AircraftType[],
  category: AircraftCategory
) => aircraftTypes.filter((aircraftType) => aircraftType.category === category);

/**
 * Lists all aircraft types marked as valid starter aircraft.
 *
 * @param aircraftTypes - The full aircraft type catalog.
 * @returns An array of valid starter aircraft types.
 */
export const listStarterAircraft = (aircraftTypes: readonly AircraftType[]) =>
  aircraftTypes.filter((aircraftType) => aircraftType.starterAircraft);

/**
 * Lists all aircraft types produced by a specific manufacturer.
 *
 * @param aircraftTypes - The full aircraft type catalog.
 * @param manufacturerId - The manufacturer ID to filter by.
 * @returns An array of matching aircraft types.
 */
export const listAircraftByManufacturer = (
  aircraftTypes: readonly AircraftType[],
  manufacturerId: AircraftType["manufacturerId"]
) => aircraftTypes.filter((aircraftType) => aircraftType.manufacturerId === manufacturerId);

/**
 * Compares aircraft types within a category for side-by-side evaluation.
 *
 * @param aircraftTypes - The full aircraft type catalog.
 * @param category - The category to compare.
 * @returns A summary list of aircraft stats for comparison.
 */
export const compareAircraftInSameCategory = (
  aircraftTypes: readonly AircraftType[],
  category: AircraftCategory
): AircraftComparison[] =>
  listAircraftByCategory(aircraftTypes, category).map((aircraftType) => ({
    aircraftTypeId: aircraftType.id,
    capacity: aircraftType.capacity,
    rangeNm: aircraftType.rangeNm,
    cruiseSpeedKtas: aircraftType.cruiseSpeedKtas,
    operatingCostRating: aircraftType.operatingCostRating,
    maintenanceCostRating: aircraftType.maintenanceCostRating,
    reliabilityRating: aircraftType.reliabilityRating,
    comfortRating: aircraftType.comfortRating,
    cargoStorageRating: aircraftType.cargoStorageRating,
    purchasePrice: aircraftType.purchasePrice,
    monthlyLeasePrice: aircraftType.monthlyLeasePrice
  }));

/**
 * Checks if an aircraft type is legally or operationally allowed in Act 1.
 *
 * @param aircraftType - The aircraft type to check.
 * @returns True if allowed.
 */
export const isAircraftAllowedForAct1 = (aircraftType: AircraftType) =>
  aircraftType.act1Allowed === true;

/**
 * Checks if an aircraft can operate from a specific runway class.
 *
 * @param aircraftType - The aircraft type to check.
 * @param runwayClass - The runway class to compare against.
 * @returns True if the runway is sufficient for the aircraft.
 */
export const isRunwayCompatible = (aircraftType: AircraftType, runwayClass: RunwayClass) =>
  RUNWAY_CLASS_RANK[runwayClass] >= RUNWAY_CLASS_RANK[aircraftType.airportRunwayRequirement];

/**
 * Options for overriding the default physical state of a newly created aircraft instance.
 */
export type AircraftInstanceOverrides = Partial<
  Pick<
    AircraftInstance,
    | "ageYears"
    | "flightHours"
    | "cycles"
    | "condition"
    | "cabinCondition"
    | "reliabilityModifier"
    | "residualValue"
  >
>;

/**
 * Core builder for creating a new AircraftInstance from template and option data.
 *
 * @param aircraftType - The base aircraft type template.
 * @param option - The acquisition structure chosen.
 * @param input - The unique instance identity (ID, registration, base).
 * @param overrides - Optional physical state overrides (age, condition, etc.).
 * @returns A fully populated aircraft instance.
 */
const buildAircraftInstance = (
  aircraftType: AircraftType,
  option: AcquisitionOption,
  input: AircraftInstanceInput,
  overrides: AircraftInstanceOverrides = {}
): AircraftInstance => ({
  id: input.id,
  aircraftTypeId: aircraftType.id,
  registration: input.registration,
  ageYears: overrides.ageYears ?? 0,
  flightHours: overrides.flightHours ?? 0,
  cycles: overrides.cycles ?? 0,
  condition: overrides.condition ?? option.condition ?? 100,
  cabinCondition: overrides.cabinCondition ?? option.cabinCondition ?? 100,
  reliabilityModifier:
    overrides.reliabilityModifier !== undefined
      ? overrides.reliabilityModifier
      : (option.reliabilityModifier ?? 0),
  maintenanceStatus: "available",
  ownership: {
    acquisitionType: option.acquisitionType,
    legalOwner: option.legalOwner,
    paymentResponsibleParty: option.paymentResponsibleParty,
    operationalControl: option.operationalControl,
    partnerId: option.partnerId,
    partnerContractId: option.partnerContractId,
    restrictedToContractIds: option.restrictedToContractIds,
    canBeRetainedAfterSeparation: option.canBeRetainedAfterSeparation,
    buyoutPrice: option.buyoutPrice,
    mustReturnOnSeparation: option.mustReturnOnSeparation
  },
  monthlyPayment: option.monthlyPayment,
  residualValue: overrides.residualValue ?? Math.round(aircraftType.purchasePrice * 0.72),
  assignedBase: input.assignedBase,
  contractRestrictions: option.restrictedToContractIds
});

/**
 * Creates an aircraft instance directly from a generated market acquisition option.
 *
 * @param aircraftType - The base aircraft type.
 * @param option - The specific market option.
 * @param input - The unique instance identity.
 * @returns A new aircraft instance.
 */
export const createAircraftInstanceFromAcquisition = (
  aircraftType: AircraftType,
  option: AcquisitionOption,
  input: AircraftInstanceInput
) => buildAircraftInstance(aircraftType, option, input);

/**
 * Creates a starting aircraft instance with Act 1 specific wear and tear.
 *
 * @param aircraftType - The base aircraft type.
 * @param input - The unique instance identity.
 * @returns A new starter aircraft instance.
 */
export const createStartingAircraftInstance = (
  aircraftType: AircraftType,
  input: AircraftInstanceInput
) =>
  buildAircraftInstance(
    aircraftType,
    {
      acquisitionType: "starting-aircraft",
      upfrontCost: Math.round(aircraftType.purchasePrice * 0.58),
      monthlyPayment: 0,
      deliveryTimeDays: 0,
      condition: aircraftType.starterProfile?.condition ?? 80,
      cabinCondition: aircraftType.starterProfile?.cabinCondition ?? 70,
      reliabilityModifier: aircraftType.starterProfile?.reliabilityModifier ?? 0,
      legalOwner: "player-airline",
      paymentResponsibleParty: "player-airline",
      operationalControl: "player-airline",
      restrictedToContractIds: [],
      canBeRetainedAfterSeparation: true,
      mustReturnOnSeparation: false
    },
    input,
    {
      ageYears: aircraftType.starterProfile?.ageYears ?? 0,
      flightHours: aircraftType.starterProfile?.flightHours ?? 0,
      cycles: aircraftType.starterProfile?.cycles ?? 0,
      residualValue: Math.round(aircraftType.purchasePrice * 0.55)
    }
  );

/**
 * Creates a used aircraft instance with physical state derived from its history.
 *
 * @param aircraftType - The base aircraft type.
 * @param input - The used aircraft physical and identity data.
 * @returns A new used aircraft instance.
 */
export const createUsedAircraftInstance = (
  aircraftType: AircraftType,
  input: UsedAircraftInput
) => {
  const agePenalty = Math.floor(input.ageYears / 4);
  const conditionPenalty = Math.max(0, Math.floor((100 - input.condition) / 8));
  const reliabilityModifier = -Math.min(35, agePenalty + conditionPenalty);

  return buildAircraftInstance(
    aircraftType,
    {
      acquisitionType: "used-purchase",
      upfrontCost: Math.round(aircraftType.purchasePrice * (input.condition / 100) * 0.82),
      monthlyPayment: 0,
      deliveryTimeDays: 0,
      condition: input.condition,
      cabinCondition: input.cabinCondition,
      reliabilityModifier,
      legalOwner: "player-airline",
      paymentResponsibleParty: "player-airline",
      operationalControl: "player-airline",
      restrictedToContractIds: [],
      canBeRetainedAfterSeparation: true,
      mustReturnOnSeparation: false
    },
    input,
    {
      ageYears: input.ageYears,
      flightHours: input.flightHours,
      cycles: input.cycles,
      residualValue: Math.round(aircraftType.purchasePrice * (input.condition / 100) * 0.55)
    }
  );
};

/**
 * Creates a leased aircraft instance (operating, wet, or finance).
 *
 * @param aircraftType - The base aircraft type.
 * @param input - The unique instance identity.
 * @param acquisitionType - The specific lease structure (defaults to operating-lease).
 * @returns A new leased aircraft instance.
 */
export const createLeasedAircraftInstance = (
  aircraftType: AircraftType,
  input: AircraftInstanceInput,
  acquisitionType: "operating-lease" | "wet-lease" | "finance-lease" = "operating-lease"
) =>
  buildAircraftInstance(
    aircraftType,
    {
      acquisitionType,
      upfrontCost: Math.round(aircraftType.monthlyLeasePrice * 2),
      monthlyPayment:
        acquisitionType === "wet-lease"
          ? Math.round(aircraftType.monthlyLeasePrice * 1.85)
          : aircraftType.monthlyLeasePrice,
      deliveryTimeDays: Math.max(14, Math.ceil(aircraftType.deliveryTimeDays * 0.2)),
      condition: 92,
      cabinCondition: 88,
      reliabilityModifier: 1,
      legalOwner: acquisitionType === "finance-lease" ? "player-airline" : "lessor",
      paymentResponsibleParty: "player-airline",
      operationalControl: "player-airline",
      restrictedToContractIds: [],
      canBeRetainedAfterSeparation: acquisitionType === "finance-lease",
      mustReturnOnSeparation: acquisitionType !== "finance-lease"
    },
    input,
    {
      ageYears: 3,
      flightHours: 900,
      cycles: 540,
      residualValue: Math.round(aircraftType.purchasePrice * 0.68)
    }
  );

export type RelationshipIssue = {
  path: string;
  message: string;
};

/**
 * Helper to check if a value exists in a set.
 *
 * @param values - The set of values to check against.
 * @param value - The value to look for.
 * @returns True if the value exists in the set.
 */
const has = <T extends string>(values: ReadonlySet<T>, value: T) => values.has(value);

type ValidationContext = {
  airports: ReadonlySet<string>;
  manufacturers: ReadonlySet<string>;
  aircraftTypes: ReadonlySet<string>;
  aircraft: ReadonlySet<string>;
  routes: ReadonlySet<string>;
  schedules: ReadonlySet<string>;
  contracts: ReadonlySet<string>;
  objectives: ReadonlySet<string>;
  objectiveProgress: ReadonlySet<string>;
  unlocks: ReadonlySet<string>;
  messages: ReadonlySet<string>;
  knownAirports: ReadonlySet<string>;
  unlockedAirports: ReadonlySet<string>;
};

/**
 * Validates the relationships for the airline and its basic references.
 *
 * @param save - The save game to validate.
 * @param ctx - The validation context containing lookup sets.
 * @param issues - The list of issues to append to.
 */
const validateAirline = (save: SaveGame, ctx: ValidationContext, issues: RelationshipIssue[]) => {
  if (!has(ctx.airports, save.airline.homeAirportId)) {
    issues.push({
      path: "airline.homeAirportId",
      message: "Airline home airport must exist in save airports."
    });
  }

  if (save.trackedObjectiveId && !has(ctx.objectives, save.trackedObjectiveId)) {
    issues.push({
      path: "trackedObjectiveId",
      message: "Tracked objective must exist in save objectives."
    });
  }

  if (
    save.airline.activeTrackedObjectiveId &&
    !has(ctx.objectives, save.airline.activeTrackedObjectiveId)
  ) {
    issues.push({
      path: "airline.activeTrackedObjectiveId",
      message: "Airline active tracked objective must exist in save objectives."
    });
  }

  const airlineLists: Array<{
    ids: string[];
    path: string;
    set: ReadonlySet<string>;
    label: string;
  }> = [
    {
      ids: save.airline.aircraftIds,
      path: "airline.aircraftIds",
      set: ctx.aircraft,
      label: "aircraft"
    },
    {
      ids: save.airline.routeIds,
      path: "airline.routeIds",
      set: ctx.routes,
      label: "route"
    },
    {
      ids: save.airline.contractIds,
      path: "airline.contractIds",
      set: ctx.contracts,
      label: "contract"
    },
    {
      ids: save.airline.objectiveProgressIds,
      path: "airline.objectiveProgressIds",
      set: ctx.objectiveProgress,
      label: "objective progress"
    },
    {
      ids: save.airline.featureUnlocks,
      path: "airline.featureUnlocks",
      set: ctx.unlocks,
      label: "unlock"
    }
  ];

  for (const list of airlineLists) {
    for (const id of list.ids) {
      if (!has(list.set, id)) {
        issues.push({
          path: list.path,
          message: `Airline ${list.label} reference is missing: ${id}`
        });
      }
    }
  }
};

/**
 * Validates the relationships for aircraft types and aircraft instances.
 *
 * @param save - The save game to validate.
 * @param ctx - The validation context containing lookup sets.
 * @param issues - The list of issues to append to.
 */
const validateAircraftEntities = (
  save: SaveGame,
  ctx: ValidationContext,
  issues: RelationshipIssue[]
) => {
  for (const type of save.aircraftTypes) {
    if (!has(ctx.manufacturers, type.manufacturerId)) {
      issues.push({
        path: `aircraftTypes.${type.id}.manufacturerId`,
        message: "Aircraft type manufacturer must exist."
      });
    }
  }

  for (const item of save.aircraft) {
    if (!has(ctx.aircraftTypes, item.aircraftTypeId)) {
      issues.push({
        path: `aircraft.${item.id}.aircraftTypeId`,
        message: "Aircraft instance type must exist."
      });
    }
    if (!has(ctx.airports, item.assignedBase)) {
      issues.push({
        path: `aircraft.${item.id}.assignedBase`,
        message: "Aircraft assigned base must exist."
      });
    }
    if (item.assignedScheduleId && !has(ctx.schedules, item.assignedScheduleId)) {
      issues.push({
        path: `aircraft.${item.id}.assignedScheduleId`,
        message: "Aircraft assigned schedule must exist."
      });
    }

    // Validate ownership references
    if (item.ownership.partnerContractId && !has(ctx.contracts, item.ownership.partnerContractId)) {
      issues.push({
        path: `aircraft.${item.id}.ownership.partnerContractId`,
        message: "Aircraft ownership partner contract must exist."
      });
    }

    for (const id of item.ownership.restrictedToContractIds) {
      if (!has(ctx.contracts, id)) {
        issues.push({
          path: `aircraft.${item.id}.ownership.restrictedToContractIds`,
          message: `Aircraft ownership contract restriction is missing: ${id}`
        });
      }
    }

    for (const id of item.contractRestrictions) {
      if (!has(ctx.contracts, id)) {
        issues.push({
          path: `aircraft.${item.id}.contractRestrictions`,
          message: `Aircraft contract restriction is missing: ${id}`
        });
      }
    }
  }
};

/**
 * Validates the relationships for routes, schedules, and individual flights.
 *
 * @param save - The save game to validate.
 * @param ctx - The validation context containing lookup sets.
 * @param issues - The list of issues to append to.
 */
const validateRoutesAndSchedules = (
  save: SaveGame,
  ctx: ValidationContext,
  issues: RelationshipIssue[]
) => {
  for (const route of save.routes) {
    if (!has(ctx.airports, route.originAirportId)) {
      issues.push({
        path: `routes.${route.id}.originAirportId`,
        message: "Route origin airport must exist."
      });
    }
    if (!has(ctx.airports, route.destinationAirportId)) {
      issues.push({
        path: `routes.${route.id}.destinationAirportId`,
        message: "Route destination airport must exist."
      });
    }
    for (const id of route.assignedScheduleIds) {
      if (!has(ctx.schedules, id)) {
        issues.push({
          path: `routes.${route.id}.assignedScheduleIds`,
          message: `Route schedule reference is missing: ${id}`
        });
      }
    }
    for (const id of route.relatedContractIds) {
      if (!has(ctx.contracts, id)) {
        issues.push({
          path: `routes.${route.id}.relatedContractIds`,
          message: `Route related contract reference is missing: ${id}`
        });
      }
    }
  }

  for (const schedule of save.schedules) {
    if (!has(ctx.aircraft, schedule.aircraftInstanceId)) {
      issues.push({
        path: `schedules.${schedule.id}.aircraftInstanceId`,
        message: "Schedule aircraft must exist."
      });
    }
    if (!has(ctx.airports, schedule.baseAirportId)) {
      issues.push({
        path: `schedules.${schedule.id}.baseAirportId`,
        message: "Schedule base airport must exist."
      });
    }
    for (const flight of schedule.flights) {
      if (!has(ctx.routes, flight.routeId)) {
        issues.push({
          path: `schedules.${schedule.id}.flights.${flight.id}.routeId`,
          message: "Scheduled flight route must exist."
        });
      }
      if (!has(ctx.aircraft, flight.aircraftInstanceId)) {
        issues.push({
          path: `schedules.${schedule.id}.flights.${flight.id}.aircraftInstanceId`,
          message: "Scheduled flight aircraft must exist."
        });
      }
    }
  }
};

/**
 * Validates the relationships for contracts and objective progress.
 *
 * @param save - The save game to validate.
 * @param ctx - The validation context containing lookup sets.
 * @param issues - The list of issues to append to.
 */
const validateContractsAndProgress = (
  save: SaveGame,
  ctx: ValidationContext,
  issues: RelationshipIssue[]
) => {
  for (const contract of save.contracts) {
    if (contract.relatedRouteId && !has(ctx.routes, contract.relatedRouteId)) {
      issues.push({
        path: `contracts.${contract.id}.relatedRouteId`,
        message: "Contract route must exist."
      });
    }
    if (contract.trackableObjectiveId && !has(ctx.objectives, contract.trackableObjectiveId)) {
      issues.push({
        path: `contracts.${contract.id}.trackableObjectiveId`,
        message: "Contract trackable objective must exist."
      });
    }
    for (const id of contract.relatedAirportIds) {
      if (!has(ctx.airports, id)) {
        issues.push({
          path: `contracts.${contract.id}.relatedAirportIds`,
          message: `Contract related airport reference is missing: ${id}`
        });
      }
    }
    for (const req of contract.requirements) {
      if (req.routeId && !has(ctx.routes, req.routeId)) {
        issues.push({
          path: `contracts.${contract.id}.requirements`,
          message: `Contract requirement route reference is missing: ${req.routeId}`
        });
      }
      for (const airportId of req.airportIds) {
        if (!has(ctx.airports, airportId)) {
          issues.push({
            path: `contracts.${contract.id}.requirements`,
            message: `Contract requirement airport reference is missing: ${airportId}`
          });
        }
      }
    }
  }

  for (const progress of save.objectiveProgress) {
    if (!has(ctx.objectives, progress.objectiveId)) {
      issues.push({
        path: `objectiveProgress.${progress.id}.objectiveId`,
        message: "Objective progress target must exist."
      });
    }
  }
};

/**
 * Validates the relationships for top-level save game collections.
 *
 * @param save - The save game to validate.
 * @param ctx - The validation context containing lookup sets.
 * @param issues - The list of issues to append to.
 */
const validateSaveCollections = (
  save: SaveGame,
  ctx: ValidationContext,
  issues: RelationshipIssue[]
) => {
  for (const id of save.knownAirportIds) {
    if (!has(ctx.airports, id)) {
      issues.push({
        path: "knownAirportIds",
        message: `Known airport reference is missing: ${id}`
      });
    }
  }

  for (const id of save.unlockedAirportIds) {
    if (!has(ctx.airports, id)) {
      issues.push({
        path: "unlockedAirportIds",
        message: `Unlocked airport reference is missing: ${id}`
      });
    }
  }

  for (const message of save.inboxMessages) {
    if (message.relatedObjectiveId && !has(ctx.objectives, message.relatedObjectiveId)) {
      issues.push({
        path: `inboxMessages.${message.id}.relatedObjectiveId`,
        message: "Inbox message objective must exist."
      });
    }
    if (message.relatedContractId && !has(ctx.contracts, message.relatedContractId)) {
      issues.push({
        path: `inboxMessages.${message.id}.relatedContractId`,
        message: "Inbox message contract must exist."
      });
    }
    if (message.relatedRouteId && !has(ctx.routes, message.relatedRouteId)) {
      issues.push({
        path: `inboxMessages.${message.id}.relatedRouteId`,
        message: "Inbox message route must exist."
      });
    }
    if (message.relatedAircraftId && !has(ctx.aircraft, message.relatedAircraftId)) {
      issues.push({
        path: `inboxMessages.${message.id}.relatedAircraftId`,
        message: "Inbox message aircraft must exist."
      });
    }
    if (message.rewardUnlockId && !has(ctx.unlocks, message.rewardUnlockId)) {
      issues.push({
        path: `inboxMessages.${message.id}.rewardUnlockId`,
        message: "Inbox message reward unlock must exist."
      });
    }
  }

  for (const report of save.reports) {
    for (const change of report.aircraftConditionChanges) {
      if (!has(ctx.aircraft, change.aircraftId)) {
        issues.push({
          path: `reports.${report.id}.aircraftConditionChanges`,
          message: `Report aircraft reference is missing: ${change.aircraftId}`
        });
      }
    }
  }
};

/**
 * Validates the save-state wrappers that mirror top-level save collections.
 *
 * @param save - The save game being validated.
 * @param ctx - The lookup context for cross-reference checks.
 * @param issues - The list of issues to append to.
 */
const validateDerivedSaveState = (
  save: SaveGame,
  ctx: ValidationContext,
  issues: RelationshipIssue[]
) => {
  for (const id of save.inboxState.messageIds) {
    if (!has(ctx.messages, id)) {
      issues.push({
        path: "inboxState.messageIds",
        message: `Inbox state message reference is missing: ${id}`
      });
    }
  }

  for (const id of save.inboxState.unreadMessageIds) {
    if (!has(ctx.messages, id)) {
      issues.push({
        path: "inboxState.unreadMessageIds",
        message: `Inbox state unread message reference is missing: ${id}`
      });
    }
  }

  if (
    save.objectiveState.trackedObjectiveId &&
    !has(ctx.objectives, save.objectiveState.trackedObjectiveId)
  ) {
    issues.push({
      path: "objectiveState.trackedObjectiveId",
      message: "Objective state tracked objective must exist in save objectives."
    });
  }

  for (const id of save.objectiveState.activeObjectiveIds) {
    if (!has(ctx.objectives, id)) {
      issues.push({
        path: "objectiveState.activeObjectiveIds",
        message: `Objective state active objective reference is missing: ${id}`
      });
    }
  }

  for (const id of save.objectiveState.completedObjectiveIds) {
    if (!has(ctx.objectives, id)) {
      issues.push({
        path: "objectiveState.completedObjectiveIds",
        message: `Objective state completed objective reference is missing: ${id}`
      });
    }
  }

  for (const id of save.objectiveState.objectiveProgressIds) {
    if (!has(ctx.objectiveProgress, id)) {
      issues.push({
        path: "objectiveState.objectiveProgressIds",
        message: `Objective state progress reference is missing: ${id}`
      });
    }
  }

  for (const transaction of save.financeState.transactionHistory) {
    if (transaction.relatedAircraftId && !has(ctx.aircraft, transaction.relatedAircraftId)) {
      issues.push({
        path: `financeState.transactionHistory.${transaction.id}.relatedAircraftId`,
        message: "Finance state transaction aircraft must exist."
      });
    }

    if (transaction.relatedContractId && !has(ctx.contracts, transaction.relatedContractId)) {
      issues.push({
        path: `financeState.transactionHistory.${transaction.id}.relatedContractId`,
        message: "Finance state transaction contract must exist."
      });
    }

    if (transaction.relatedRouteId && !has(ctx.routes, transaction.relatedRouteId)) {
      issues.push({
        path: `financeState.transactionHistory.${transaction.id}.relatedRouteId`,
        message: "Finance state transaction route must exist."
      });
    }
  }
};

/**
 * Validates the referential integrity of a save game object.
 * Checks that all ID references (e.g., aircraftTypeId on an Aircraft) point to
 * an existing entity within the same save game.
 *
 * @param save - The save game object to validate.
 * @returns An array of relationship issues found, or an empty array if all references are valid.
 */
export const validateSaveGameRelationships = (save: SaveGame): RelationshipIssue[] => {
  const issues: RelationshipIssue[] = [];
  const ctx: ValidationContext = {
    airports: new Set(save.airports.map((airport) => airport.id)),
    manufacturers: new Set(save.aircraftManufacturers.map((manufacturer) => manufacturer.id)),
    aircraftTypes: new Set(save.aircraftTypes.map((type) => type.id)),
    aircraft: new Set(save.aircraft.map((item) => item.id)),
    routes: new Set(save.routes.map((route) => route.id)),
    schedules: new Set(save.schedules.map((schedule) => schedule.id)),
    contracts: new Set(save.contracts.map((contract) => contract.id)),
    objectives: new Set(save.objectives.map((objective) => objective.id)),
    objectiveProgress: new Set(save.objectiveProgress.map((progress) => progress.id)),
    unlocks: new Set(save.featureUnlocks.map((unlock) => unlock.id)),
    messages: new Set(save.inboxMessages.map((message) => message.id)),
    knownAirports: new Set(save.knownAirportIds),
    unlockedAirports: new Set(save.unlockedAirportIds)
  };

  validateAirline(save, ctx, issues);
  validateAircraftEntities(save, ctx, issues);
  validateRoutesAndSchedules(save, ctx, issues);
  validateContractsAndProgress(save, ctx, issues);
  validateSaveCollections(save, ctx, issues);
  validateDerivedSaveState(save, ctx, issues);

  return issues;
};

type StarterAirport = (typeof starterAirportCatalogEntries)[number];

/**
 * Maps the detailed curated runway class of a starter airport to the broader aircraft capability class.
 *
 * @param runwayClass - The specific curated runway class (e.g., 'small', 'medium').
 * @returns The general capability class for aircraft assignment (e.g., 'short', 'regional').
 */
const mapStarterRunwayClass = (runwayClass: StarterAirport["curated"]["runwayClass"]) => {
  switch (runwayClass) {
    case "tiny":
    case "small":
      return "short";
    case "medium":
      return "regional";
    case "large":
      return "mainline";
    case "heavy":
      return "heavy";
    default:
      return "regional";
  }
};

/**
 * Issue returned when validating whether an airport can be used as the starter base.
 */
export type StarterAirportEligibilityIssue = RelationshipIssue;

/**
 * Issue returned when validating whether an aircraft type can be used as the starter aircraft.
 */
export type StarterAircraftEligibilityIssue = RelationshipIssue;

/**
 * Options for building a new airline save.
 */
export type CreateNewAirlineSaveOptions = {
  userId: SaveGame["userId"];
  airlineName: string;
  founderName: string;
  starterAirportId?: AirportId;
  starterAircraftTypeId?: AircraftTypeId;
  simulationPaceId?: SimulationPace["id"];
  difficulty?: Difficulty;
  createdAt?: string;
  currentGameTime?: string;
  paused?: boolean;
  airlineShortName?: string;
  airlineCallsign?: string;
  airlineCode: string;
  primaryMarketArea?: string;
  brandingSeed?: string;
  founderBackgroundArchetype?: string;
  founderReputationModifier?: number;
  founderFinanceModifier?: number;
  aircraftRegistration?: string;
  saveId?: SaveId;
};

const DEFAULT_BOOTSTRAP_DIFFICULTY: Difficulty = "standard";
const DEFAULT_BOOTSTRAP_PACE: SimulationPace["id"] = "standard";

/**
 * Returns the starter-airport validation issues for a candidate airport.
 *
 * @param airport - Candidate airport from the starter airport catalog.
 * @returns An array of validation issues. Empty means the airport is eligible.
 */
export const validateStarterAirportEligibility = (
  airport: StarterAirport
): StarterAirportEligibilityIssue[] => {
  const issues: StarterAirportEligibilityIssue[] = [];

  if (!airport.flags.startingAirportEligible) {
    issues.push({
      path: airport.id,
      message: "Starter airport must be marked starter-airport-eligible."
    });
  }

  if (!airport.flags.supportsFounderAircraft) {
    issues.push({
      path: airport.id,
      message: "Starter airport must support founder aircraft."
    });
  }

  if (airport.flags.isExcluded) {
    issues.push({
      path: airport.id,
      message: "Starter airport cannot be excluded."
    });
  }

  if (airport.flags.isDeferred) {
    issues.push({
      path: airport.id,
      message: "Starter airport cannot be deferred."
    });
  }

  if (!airport.flags.isPlayable) {
    issues.push({
      path: airport.id,
      message: "Starter airport must be playable."
    });
  }

  return issues;
};

/**
 * Returns the starter-aircraft validation issues for a candidate aircraft type.
 *
 * @param aircraftType - Candidate starter aircraft type.
 * @param starterAirport - Selected starter airport for runway compatibility checks.
 * @returns An array of validation issues. Empty means the aircraft is eligible.
 */
export const validateStarterAircraftEligibility = (
  aircraftType: AircraftType,
  starterAirport: StarterAirport
): StarterAircraftEligibilityIssue[] => {
  const issues: StarterAircraftEligibilityIssue[] = [];

  if (!aircraftType.starterAircraft) {
    issues.push({
      path: aircraftType.id,
      message: "Starter aircraft must be flagged as starter aircraft."
    });
  }

  if (!aircraftType.act1Allowed) {
    issues.push({
      path: aircraftType.id,
      message: "Starter aircraft must be allowed in Act 1."
    });
  }

  if (
    !isRunwayCompatible(aircraftType, mapStarterRunwayClass(starterAirport.curated.runwayClass))
  ) {
    issues.push({
      path: aircraftType.id,
      message: "Starter aircraft must be compatible with the selected starter airport."
    });
  }

  return issues;
};

/**
 * Converts a string into a URL-friendly slug.
 *
 * @param value - The string to slugify.
 * @returns A safe slug string.
 */
const slugify = (value: string) => {
  const chars = value.toLowerCase().split("");
  const filtered = chars.map((c) => (/[a-z0-9]/.test(c) ? c : "-"));
  return filtered.join("").split("-").filter(Boolean).join("-");
};

/**
 * Resolves a difficulty level to its specific preset configuration.
 *
 * @param difficulty - The desired difficulty level.
 * @returns The matching difficulty preset or the default fallback.
 */
const chooseDifficultyPreset = (difficulty: Difficulty) => {
  const preset =
    starterDifficultyPresetCatalog.find((p) => p.id === difficulty) ??
    starterDifficultyPresetCatalog.find((p) => p.id === DEFAULT_BOOTSTRAP_DIFFICULTY);
  return preset ?? starterDifficultyPresetCatalog[0];
};

/**
 * Resolves a simulation pace ID to its specific pace configuration.
 *
 * @param paceId - The desired simulation pace ID.
 * @returns The matching simulation pace or the default fallback.
 */
const chooseSimulationPace = (paceId: SimulationPace["id"]) => {
  const pace =
    starterSimulationPaceCatalog.find((p) => p.id === paceId) ??
    starterSimulationPaceCatalog.find((p) => p.id === DEFAULT_BOOTSTRAP_PACE);
  return pace ?? starterSimulationPaceCatalog[0];
};

/**
 * Resolves the starter airport, validating its eligibility.
 *
 * @param starterAirportId - The optional specific airport ID requested.
 * @returns A validated starter airport record.
 * @throws Error if the requested airport is invalid or unplayable.
 */
const chooseStarterAirport = (starterAirportId?: AirportId) => {
  const airport =
    starterAirportId === undefined
      ? starterAirportCatalogEntries[0]
      : starterAirportCatalogEntries.find((candidate) => candidate.id === starterAirportId);

  if (!airport) {
    throw new Error(
      starterAirportId
        ? `Starter airport not found: ${starterAirportId}`
        : "No starter airports are available."
    );
  }

  const issues = validateStarterAirportEligibility(airport);
  if (issues.length > 0) {
    throw new Error(issues.map((issue) => issue.message).join("; "));
  }

  return airport;
};

/**
 * Resolves the starter aircraft type, validating its eligibility against the base.
 *
 * @param starterAirport - The chosen starter airport.
 * @param aircraftTypeId - The optional specific aircraft type ID requested.
 * @returns A validated starter aircraft type.
 * @throws Error if the requested aircraft is invalid or incompatible with the airport.
 */
const chooseStarterAircraftType = (
  starterAirport: StarterAirport,
  aircraftTypeId?: AircraftTypeId
) => {
  const aircraftType =
    aircraftTypeId === undefined
      ? listStarterAircraft(starterAircraftTypesCatalog)[0]
      : findAircraftById(starterAircraftTypesCatalog, aircraftTypeId);

  if (!aircraftType) {
    throw new Error(
      aircraftTypeId
        ? `Starter aircraft not found: ${aircraftTypeId}`
        : "No starter aircraft are available."
    );
  }

  const issues = validateStarterAircraftEligibility(aircraftType, starterAirport);
  if (issues.length > 0) {
    throw new Error(issues.map((issue) => issue.message).join("; "));
  }

  return aircraftType;
};

/**
 * Derives a default short name from a full airline name by stripping common suffixes.
 *
 * @param airlineName - The full name of the airline.
 * @returns A shortened, readable brand name.
 */
const deriveAirlineShortName = (airlineName: string) => {
  const suffixes = ["air", "aviation", "airline", "airlines", "aeronautics"];
  const words = airlineName.split(/\s/);
  const filteredWords = words.filter((word) => !suffixes.includes(word.toLowerCase()));
  const cleanedName = filteredWords.join(" ").trim();
  return cleanedName || airlineName.trim();
};

/**
 * Builds a default callsign from the short name.
 *
 * @param shortName - The derived short name of the airline.
 * @returns A capitalized callsign string.
 */
const buildAirlineCallsign = (shortName: string) => shortName.toUpperCase();

/**
 * Builds a deterministic seed string for procedural brand/livery generation.
 *
 * @param airlineName - The airline's full name.
 * @param founderName - The founder's name.
 * @param airportId - The starting airport ID.
 * @returns A deterministic seed string.
 */
const buildBrandingSeed = (airlineName: string, founderName: string, airportId: AirportId) =>
  `${slugify(airlineName)}:${slugify(founderName)}:${airportId}`;

/**
 * Shifts an ISO date string forward by a given number of minutes.
 *
 * @param timestamp - The base ISO 8601 string.
 * @param minutes - The number of minutes to add.
 * @returns A new shifted ISO 8601 string.
 */
const shiftIsoDateTime = (timestamp: string, minutes: number) =>
  new Date(new Date(timestamp).getTime() + minutes * 60_000).toISOString();

/**
 * Builds a predictable ID for a generated inbox message.
 *
 * @param saveIdOrSlug - The save ID string.
 * @param templateId - The source template ID for the message.
 * @param index - The message sequence index.
 * @returns A unique inbox message ID.
 */
const buildInboxMessageId = (saveIdOrSlug: string, templateId: string, index: number) => {
  const saveSlug = saveIdOrSlug.replace(/^save:/, "");
  const templateName = templateId.split(":")[1] ?? `message-${index + 1}`;
  return `message:${saveSlug}-${slugify(templateName)}`;
};

/**
 * Builds a predictable ID for objective progress tracking.
 *
 * @param objectiveId - The target objective ID.
 * @returns A unique objective progress ID.
 */
const buildObjectiveProgressId = (objectiveId: ObjectiveId) =>
  objectiveId.replace(/^objective:/, "objective-progress:") as ObjectiveProgressId;

/**
 * Builds the initial progress entry for a tracked objective.
 *
 * @param objective - The target objective.
 * @param index - The order index of the objective in the starter sequence.
 * @param createdAt - The save creation timestamp.
 * @returns An objective progress record.
 */
const buildObjectiveProgressEntry = (
  objective: CareerObjective,
  index: number,
  createdAt: string
): ObjectiveProgress => ({
  id: buildObjectiveProgressId(objective.id),
  objectiveId: objective.id,
  status: index === 0 ? "active" : "locked",
  requirementProgress: objective.requirements.reduce<Record<string, number>>(
    (progress, requirement) => {
      progress[requirement.id] = 0;
      return progress;
    },
    {}
  ),
  startedAt: index === 0 ? createdAt : undefined,
  completedAt: undefined
});

/**
 * Builds the starting inbox messages from the catalog templates.
 *
 * @param saveSlug - The slugified save ID.
 * @param createdAt - The save creation timestamp.
 * @returns An array of generated inbox messages.
 */
const buildInboxMessages = (saveSlug: string, createdAt: string): InboxMessage[] =>
  starterInboxTemplateCatalog.map((template, index) => ({
    ...template,
    id: buildInboxMessageId(saveSlug, template.id, index),
    createdAt: shiftIsoDateTime(createdAt, index * 3 + 1),
    read: false,
    archived: false
  })) as unknown as InboxMessage[];

/**
 * Builds a deterministic ID for a new save game.
 *
 * @param airlineName - The user-provided airline name.
 * @param airportId - The chosen starting airport ID.
 * @returns A unique save ID.
 */
const buildSaveId = (airlineName: string, airportId: AirportId) =>
  `save:${slugify(airlineName)}-${airportId.replace(/^airport:/, "")}` as SaveId;

/**
 * Builds the set of known airports available at the start of the game.
 *
 * @param selectedAirportId - The chosen starting airport ID.
 * @returns An array of unlocked starter airport records.
 */
const buildStarterAirportSet = (selectedAirportId: AirportId) => {
  const airports = starterAirportCuratedStubs.filter((airport) => {
    const rec = airport as Record<string, unknown>;
    const flags = rec.flags as Record<string, unknown> | undefined;
    return (
      rec.id === selectedAirportId ||
      rec.startingAirportEligible === true ||
      flags?.startingAirportEligible === true
    );
  });

  return airports.length > 0 ? airports : starterAirportCuratedStubs;
};

/**
 * Bootstraps the initial finance state for a new save.
 *
 * @param startingCash - The initial cash provided by the difficulty preset.
 * @param preset - The selected difficulty preset.
 * @returns The initialized finance state.
 */
const buildFinanceState = (startingCash: number, preset: DifficultyPreset): FinanceState => ({
  currentCash: startingCash,
  startingLoanBalance: 0,
  recurringObligations: [
    {
      id: "obligation:maintenance-reserve",
      label: "Maintenance reserve",
      amount: Math.max(0, Math.round(startingCash * 0.12 + preset.maintenanceForgiveness * 1_000)),
      cadence: "monthly"
    },
    {
      id: "obligation:overhead",
      label: "Operations overhead",
      amount: Math.max(0, Math.round(startingCash * 0.04 * preset.fuelCostMultiplier)),
      cadence: "monthly"
    }
  ],
  maintenanceReserve: Math.max(
    0,
    Math.round(startingCash * 0.12 + preset.maintenanceForgiveness * 1_000)
  ),
  transactionHistory: []
});

/**
 * Bootstraps the top-level simulation configuration.
 *
 * @param createdAt - The save creation timestamp.
 * @param currentGameTime - The target starting game time.
 * @param difficulty - The chosen difficulty level.
 * @param simulationPaceId - The chosen simulation pace.
 * @param paused - Whether the simulation should start paused.
 * @returns The initialized simulation configuration.
 */
/**
 * Bootstraps the top-level simulation configuration.
 *
 * @param createdAt - The save creation timestamp.
 * @param currentGameTime - The target starting game time.
 * @param difficulty - The chosen difficulty level.
 * @param simulationPaceId - The chosen simulation pace.
 * @param paused - Whether the simulation should start paused.
 * @returns The initialized simulation configuration.
 */
const buildSimulationConfig = (
  createdAt: string,
  currentGameTime: string,
  difficulty: Difficulty,
  simulationPaceId: SimulationPace["id"],
  paused: boolean
): SimulationConfig => ({
  simulationPaceId,
  difficulty,
  createdAt,
  lastPlayedAt: createdAt,
  currentGameTime,
  paused
});

/**
 * Bootstraps the lightweight profile for the founder.
 *
 * @param founderName - The requested name for the founder.
 * @param options - Additional options overriding the default founder modifiers.
 * @returns The initialized founder profile.
 */
const buildFounderProfile = (
  founderName: string,
  options: Pick<
    CreateNewAirlineSaveOptions,
    "founderBackgroundArchetype" | "founderFinanceModifier" | "founderReputationModifier"
  >
): FounderProfile => ({
  id: `founder:${slugify(founderName)}` as FounderProfile["id"],
  name: founderName,
  backgroundArchetype: options.founderBackgroundArchetype,
  reputationModifier: options.founderReputationModifier ?? 0,
  financeModifier: options.founderFinanceModifier ?? 0
});

/**
 * Bootstraps the initial story and relationship state.
 *
 * @param objective - The first active objective tracking the initial story chapter.
 * @returns The initialized story state.
 */
const buildStoryState = (objective: CareerObjective): StoryState => ({
  currentAct: "act1",
  currentChapter: "founder-operator",
  flags: [
    "act1-started",
    objective.id.startsWith("objective:") ? objective.id : `objective:${objective.id}`
  ],
  majorDecisions: [],
  partnerRelationships: []
});

/**
 * Bootstraps the initial active objective state.
 *
 * @param objective - The first active objective to track.
 * @returns The initialized objective tracking state.
 */
const buildObjectiveState = (objective: CareerObjective): ObjectiveState => ({
  trackedObjectiveId: objective.id,
  activeObjectiveIds: [objective.id],
  completedObjectiveIds: [],
  objectiveProgressIds: [buildObjectiveProgressId(objective.id)],
  actId: "act1",
  chapterId: "founder-operator",
  storyFlags: [
    "act1-started",
    objective.id.startsWith("objective:") ? objective.id : `objective:${objective.id}`
  ]
});

/**
 * Bootstraps the airline's identity and branding fields.
 *
 * @param airlineName - The user-provided full airline name.
 * @param founderName - The user-provided founder name.
 * @param starterAirport - The chosen starting airport.
 * @param options - Explicit overrides for short name, callsign, and code.
 * @returns The initialized airline identity payload.
 */
const buildAirlineIdentity = (
  airlineName: string,
  founderName: string,
  starterAirport: StarterAirport,
  options: Pick<
    CreateNewAirlineSaveOptions,
    "airlineShortName" | "airlineCallsign" | "airlineCode" | "brandingSeed"
  >
): Pick<AirlineIdentity, "shortName" | "callsign" | "code" | "brandingSeed"> => {
  const shortName = options.airlineShortName ?? deriveAirlineShortName(airlineName);
  const code = options.airlineCode;
  return {
    shortName,
    callsign: options.airlineCallsign ?? buildAirlineCallsign(shortName),
    code,
    brandingSeed:
      options.brandingSeed ??
      buildBrandingSeed(airlineName, founderName, starterAirport.id as AirportId)
  };
};

/**
 * Creates a new airline save with deterministic starter data and validation.
 *
 * @param options - New save creation options.
 * @returns A fully validated save game object.
 */
export const createNewAirlineSave = (options: CreateNewAirlineSaveOptions): SaveGame => {
  const createdAt = options.createdAt ?? new Date().toISOString();
  const currentGameTime = options.currentGameTime ?? createdAt;
  const difficulty = options.difficulty ?? DEFAULT_BOOTSTRAP_DIFFICULTY;
  const simulationPaceId = options.simulationPaceId ?? DEFAULT_BOOTSTRAP_PACE;
  const founderReputationModifier = options.founderReputationModifier ?? 0;
  const difficultyPreset = chooseDifficultyPreset(difficulty);
  const simulationPace = chooseSimulationPace(simulationPaceId);
  const starterAirport = chooseStarterAirport(options.starterAirportId);
  const starterAircraftType = chooseStarterAircraftType(
    starterAirport,
    options.starterAircraftTypeId
  );
  const starterAirlineIdentity = buildAirlineIdentity(
    options.airlineName,
    options.founderName,
    starterAirport,
    options
  );
  const saveId = options.saveId ?? buildSaveId(options.airlineName, starterAirport.id);
  const starterAircraft = createStartingAircraftInstance(starterAircraftType, {
    id: `aircraft:${slugify(saveId.replace(/^save:/, ""))}` as AircraftInstanceId,
    registration:
      options.aircraftRegistration ??
      `${starterAirlineIdentity.code}-${starterAircraftType.modelCode}`,
    assignedBase: starterAirport.id
  });
  const adjustedStarterAircraft: AircraftInstance = {
    ...starterAircraft,
    reliabilityModifier:
      starterAircraft.reliabilityModifier + Math.trunc(difficultyPreset.maintenanceForgiveness / 5)
  };
  const objectives = starterObjectiveCatalog;
  const activeObjective = objectives[0];

  if (!activeObjective) {
    throw new Error("No starter objectives are available.");
  }

  const objectiveProgress = objectives.map((objective, index) =>
    buildObjectiveProgressEntry(objective, index, createdAt)
  );
  const objectiveState = buildObjectiveState(activeObjective);
  const inboxMessages = buildInboxMessages(saveId, createdAt);
  const financeState = buildFinanceState(difficultyPreset.startingCash, difficultyPreset);
  const selectedAirportIds = [
    starterAirport.id,
    ...buildStarterAirportSet(starterAirport.id)
      .map((airport) => airport.id)
      .filter((airportId) => airportId !== starterAirport.id)
  ] as AirportId[];

  const saveCandidate = {
    id: saveId,
    userId: options.userId,
    founderProfile: buildFounderProfile(options.founderName, options),
    airline: {
      id: `airline:${slugify(options.airlineName)}` as SaveGame["airline"]["id"],
      name: options.airlineName,
      shortName: starterAirlineIdentity.shortName,
      callsign: starterAirlineIdentity.callsign,
      code: starterAirlineIdentity.code,
      founderName: options.founderName,
      foundedAt: createdAt,
      homeAirportId: starterAirport.id,
      primaryMarketArea:
        options.primaryMarketArea ?? starterAirport.curated.marketArea ?? starterAirport.city,
      brandingSeed: starterAirlineIdentity.brandingSeed,
      status: "active" as AirlineStatus,
      currentPhase: "founder-operator",
      cash: financeState.currentCash,
      reputation: Math.max(
        0,
        5 + founderReputationModifier + difficultyPreset.reputationForgiveness
      ),
      credibility: Math.max(
        0,
        4 +
          Math.trunc(founderReputationModifier / 2) +
          Math.trunc(difficultyPreset.reputationForgiveness / 2)
      ),
      reliability: 100,
      operationalTrust: Math.max(
        0,
        3 +
          Math.trunc(founderReputationModifier / 2) +
          Math.trunc(difficultyPreset.reputationForgiveness / 3)
      ),
      difficulty: difficultyPreset.id as Difficulty,
      simulationPaceId: simulationPace.id,
      createdAt,
      lastSimulatedAt: currentGameTime,
      featureUnlocks: [],
      activeTrackedObjectiveId: activeObjective.id,
      aircraftIds: [adjustedStarterAircraft.id],
      routeIds: [],
      contractIds: [],
      objectiveProgressIds: objectiveProgress.map((progress) => progress.id)
    },
    simulationConfig: buildSimulationConfig(
      createdAt,
      currentGameTime,
      difficultyPreset.id as Difficulty,
      simulationPace.id,
      options.paused ?? true
    ),
    currentGameTime,
    lastSimulatedAt: currentGameTime,
    simulationPace,
    financeState,
    knownAirportIds: selectedAirportIds,
    unlockedAirportIds: selectedAirportIds,
    airports: starterSaveAirports.filter((airport) =>
      selectedAirportIds.includes(airport.id as AirportId)
    ) as unknown as SaveGame["airports"],
    aircraftManufacturers: starterAircraftManufacturersCatalog,
    aircraftTypes: starterAircraftTypesCatalog,
    aircraft: [adjustedStarterAircraft],
    routes: [],
    schedules: [],
    contracts: [],
    objectives: starterObjectiveCatalog,
    objectiveProgress,
    milestones: [],
    inboxMessages,
    inboxState: {
      messageIds: inboxMessages.map((message) => message.id),
      unreadMessageIds: inboxMessages
        .filter((message) => !message.read)
        .map((message) => message.id),
      lastInboxSyncAt: createdAt
    },
    reports: [],
    featureUnlocks: [],
    trackedObjectiveId: activeObjective.id,
    objectiveState,
    storyState: buildStoryState(activeObjective),
    settings: {
      difficulty: difficultyPreset.id as Difficulty,
      simulationPaceId: simulationPace.id,
      autosaveEnabled: true
    }
  } as unknown as SaveGame;

  const parsedSave = saveGameSchema.parse(saveCandidate);
  const relationshipIssues = validateSaveGameRelationships(parsedSave);

  if (relationshipIssues.length > 0) {
    throw new Error(
      `Starter save failed validation: ${relationshipIssues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join("; ")}`
    );
  }

  return parsedSave;
};
