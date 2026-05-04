import type { SaveGame } from "@airline-career-sim/shared";

export type SimulationModuleStatus = "foundation-ready";

export const simulationModuleStatus: SimulationModuleStatus = "foundation-ready";

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
    knownAirports: new Set(save.knownAirportIds),
    unlockedAirports: new Set(save.unlockedAirportIds)
  };

  validateAirline(save, ctx, issues);
  validateAircraftEntities(save, ctx, issues);
  validateRoutesAndSchedules(save, ctx, issues);
  validateContractsAndProgress(save, ctx, issues);
  validateSaveCollections(save, ctx, issues);

  return issues;
};
