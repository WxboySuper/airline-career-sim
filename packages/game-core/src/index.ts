import type { SaveGame } from "@airline-career-sim/shared";

export type SimulationModuleStatus = "foundation-ready";

export const simulationModuleStatus: SimulationModuleStatus = "foundation-ready";

export type RelationshipIssue = {
  path: string;
  message: string;
};

const has = <T extends string>(values: ReadonlySet<T>, value: T) => values.has(value);

export const validateSaveGameRelationships = (save: SaveGame): RelationshipIssue[] => {
  const issues: RelationshipIssue[] = [];
  const airports = new Set(save.airports.map((airport) => airport.id));
  const manufacturers = new Set(save.aircraftManufacturers.map((manufacturer) => manufacturer.id));
  const aircraftTypes = new Set(save.aircraftTypes.map((type) => type.id));
  const aircraft = new Set(save.aircraft.map((item) => item.id));
  const routes = new Set(save.routes.map((route) => route.id));
  const schedules = new Set(save.schedules.map((schedule) => schedule.id));
  const contracts = new Set(save.contracts.map((contract) => contract.id));
  const objectives = new Set(save.objectives.map((objective) => objective.id));
  const objectiveProgress = new Set(save.objectiveProgress.map((progress) => progress.id));
  const unlocks = new Set(save.featureUnlocks.map((unlock) => unlock.id));

  if (!has(airports, save.airline.homeAirportId)) {
    issues.push({
      path: "airline.homeAirportId",
      message: "Airline home airport must exist in save airports."
    });
  }

  if (save.trackedObjectiveId && !has(objectives, save.trackedObjectiveId)) {
    issues.push({
      path: "trackedObjectiveId",
      message: "Tracked objective must exist in save objectives."
    });
  }

  for (const id of save.airline.aircraftIds) {
    if (!has(aircraft, id)) {
      issues.push({
        path: "airline.aircraftIds",
        message: `Airline aircraft reference is missing: ${id}`
      });
    }
  }

  for (const id of save.airline.routeIds) {
    if (!has(routes, id)) {
      issues.push({
        path: "airline.routeIds",
        message: `Airline route reference is missing: ${id}`
      });
    }
  }

  for (const id of save.airline.contractIds) {
    if (!has(contracts, id)) {
      issues.push({
        path: "airline.contractIds",
        message: `Airline contract reference is missing: ${id}`
      });
    }
  }

  for (const id of save.airline.objectiveProgressIds) {
    if (!has(objectiveProgress, id)) {
      issues.push({
        path: "airline.objectiveProgressIds",
        message: `Airline objective progress reference is missing: ${id}`
      });
    }
  }

  for (const id of save.airline.featureUnlocks) {
    if (!has(unlocks, id)) {
      issues.push({
        path: "airline.featureUnlocks",
        message: `Airline unlock reference is missing: ${id}`
      });
    }
  }

  for (const type of save.aircraftTypes) {
    if (!has(manufacturers, type.manufacturerId)) {
      issues.push({
        path: `aircraftTypes.${type.id}.manufacturerId`,
        message: "Aircraft type manufacturer must exist."
      });
    }
  }

  for (const item of save.aircraft) {
    if (!has(aircraftTypes, item.aircraftTypeId)) {
      issues.push({
        path: `aircraft.${item.id}.aircraftTypeId`,
        message: "Aircraft instance type must exist."
      });
    }
    if (!has(airports, item.assignedBase)) {
      issues.push({
        path: `aircraft.${item.id}.assignedBase`,
        message: "Aircraft assigned base must exist."
      });
    }
    if (item.assignedScheduleId && !has(schedules, item.assignedScheduleId)) {
      issues.push({
        path: `aircraft.${item.id}.assignedScheduleId`,
        message: "Aircraft assigned schedule must exist."
      });
    }
  }

  for (const route of save.routes) {
    if (!has(airports, route.originAirportId)) {
      issues.push({
        path: `routes.${route.id}.originAirportId`,
        message: "Route origin airport must exist."
      });
    }
    if (!has(airports, route.destinationAirportId)) {
      issues.push({
        path: `routes.${route.id}.destinationAirportId`,
        message: "Route destination airport must exist."
      });
    }
    for (const id of route.assignedScheduleIds) {
      if (!has(schedules, id)) {
        issues.push({
          path: `routes.${route.id}.assignedScheduleIds`,
          message: `Route schedule reference is missing: ${id}`
        });
      }
    }
  }

  for (const schedule of save.schedules) {
    if (!has(aircraft, schedule.aircraftInstanceId)) {
      issues.push({
        path: `schedules.${schedule.id}.aircraftInstanceId`,
        message: "Schedule aircraft must exist."
      });
    }
    if (!has(airports, schedule.baseAirportId)) {
      issues.push({
        path: `schedules.${schedule.id}.baseAirportId`,
        message: "Schedule base airport must exist."
      });
    }
    for (const flight of schedule.flights) {
      if (!has(routes, flight.routeId)) {
        issues.push({
          path: `schedules.${schedule.id}.flights.${flight.id}.routeId`,
          message: "Scheduled flight route must exist."
        });
      }
      if (!has(aircraft, flight.aircraftInstanceId)) {
        issues.push({
          path: `schedules.${schedule.id}.flights.${flight.id}.aircraftInstanceId`,
          message: "Scheduled flight aircraft must exist."
        });
      }
    }
  }

  for (const contract of save.contracts) {
    if (contract.relatedRouteId && !has(routes, contract.relatedRouteId)) {
      issues.push({
        path: `contracts.${contract.id}.relatedRouteId`,
        message: "Contract route must exist."
      });
    }
    if (contract.trackableObjectiveId && !has(objectives, contract.trackableObjectiveId)) {
      issues.push({
        path: `contracts.${contract.id}.trackableObjectiveId`,
        message: "Contract trackable objective must exist."
      });
    }
  }

  for (const progress of save.objectiveProgress) {
    if (!has(objectives, progress.objectiveId)) {
      issues.push({
        path: `objectiveProgress.${progress.id}.objectiveId`,
        message: "Objective progress target must exist."
      });
    }
  }

  return issues;
};
