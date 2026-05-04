import { z } from "zod";

export const productName = "Airline Career Simulator";

export type HealthResponse = {
  ok: true;
  service: typeof productName;
};

export type Brand<TValue, TBrand extends string> = TValue & {
  readonly __brand: TBrand;
};

export type UserId = Brand<string, "UserId">;
export type AirlineId = Brand<string, "AirlineId">;
export type AirportId = Brand<string, "AirportId">;
export type AircraftManufacturerId = Brand<string, "AircraftManufacturerId">;
export type AircraftTypeId = Brand<string, "AircraftTypeId">;
export type AircraftInstanceId = Brand<string, "AircraftInstanceId">;
export type RouteId = Brand<string, "RouteId">;
export type ScheduleId = Brand<string, "ScheduleId">;
export type FlightId = Brand<string, "FlightId">;
export type ContractId = Brand<string, "ContractId">;
export type ObjectiveId = Brand<string, "ObjectiveId">;
export type ObjectiveProgressId = Brand<string, "ObjectiveProgressId">;
export type InboxMessageId = Brand<string, "InboxMessageId">;
export type ReportId = Brand<string, "ReportId">;
export type SaveId = Brand<string, "SaveId">;
export type FeatureUnlockId = Brand<string, "FeatureUnlockId">;

const brandedIdSchema = <TBrand extends string>(prefix: string) =>
  z
    .string()
    .regex(new RegExp(`^${prefix}:[a-z0-9][a-z0-9-]*$`))
    .brand<TBrand>();

export const userIdSchema = brandedIdSchema<"UserId">("user");
export const airlineIdSchema = brandedIdSchema<"AirlineId">("airline");
export const airportIdSchema = brandedIdSchema<"AirportId">("airport");
export const aircraftManufacturerIdSchema =
  brandedIdSchema<"AircraftManufacturerId">("manufacturer");
export const aircraftTypeIdSchema =
  brandedIdSchema<"AircraftTypeId">("aircraft-type");
export const aircraftInstanceIdSchema =
  brandedIdSchema<"AircraftInstanceId">("aircraft");
export const routeIdSchema = brandedIdSchema<"RouteId">("route");
export const scheduleIdSchema = brandedIdSchema<"ScheduleId">("schedule");
export const flightIdSchema = brandedIdSchema<"FlightId">("flight");
export const contractIdSchema = brandedIdSchema<"ContractId">("contract");
export const objectiveIdSchema = brandedIdSchema<"ObjectiveId">("objective");
export const objectiveProgressIdSchema =
  brandedIdSchema<"ObjectiveProgressId">("objective-progress");
export const inboxMessageIdSchema =
  brandedIdSchema<"InboxMessageId">("message");
export const reportIdSchema = brandedIdSchema<"ReportId">("report");
export const saveIdSchema = brandedIdSchema<"SaveId">("save");
export const featureUnlockIdSchema =
  brandedIdSchema<"FeatureUnlockId">("unlock");

const scoreSchema = z.number().int().min(0).max(100);
const positiveMoneySchema = z.number().int().nonnegative();
const moneySchema = z.number().int();
const isoDateTimeSchema = z.string().datetime({ offset: true });
const minutesSchema = z.number().int().nonnegative();

export const careerPhaseSchema = z.enum([
  "founder-operator",
  "scheduled-commuter",
  "regional-partner",
  "affiliate-growth",
  "independence-path",
  "self-sufficient-regional",
  "national-expansion",
]);
export type CareerPhase = z.infer<typeof careerPhaseSchema>;

export const difficultySchema = z.enum(["relaxed", "standard", "hard"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const featureUnlockSchema = z.object({
  id: featureUnlockIdSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  unlockedAt: isoDateTimeSchema.optional(),
  sourceObjectiveId: objectiveIdSchema.optional(),
});
export type FeatureUnlock = z.infer<typeof featureUnlockSchema>;

export const simulationPaceSchema = z.object({
  id: z.enum(["manual", "slow", "standard", "fast"]),
  displayName: z.string().min(1),
  realMinutesPerGameDay: z.number().positive(),
  catchUpEnabled: z.boolean(),
  catchUpCapGameDays: z.number().int().positive().optional(),
});
export type SimulationPace = z.infer<typeof simulationPaceSchema>;

export const rawAirportEntrySchema = z.object({
  icao: z.string().min(3).max(4),
  iata: z.string().min(3).max(3).optional(),
  name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  elevationFeet: z.number().int().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1),
});
export type RawAirportEntry = z.infer<typeof rawAirportEntrySchema>;

export const rawAirportSchema = z.record(
  z.string().min(3),
  rawAirportEntrySchema,
);
export type RawAirportSource = z.infer<typeof rawAirportSchema>;

export const airportClassSchema = z.enum([
  "airstrip",
  "community",
  "regional",
  "commercial",
  "major",
  "global-gateway",
]);
export type AirportClass = z.infer<typeof airportClassSchema>;

export const runwayClassSchema = z.enum([
  "short",
  "standard",
  "regional",
  "mainline",
  "heavy",
]);
export type RunwayClass = z.infer<typeof runwayClassSchema>;

export const curatedAirportSchema = rawAirportEntrySchema.extend({
  id: airportIdSchema,
  airportClass: airportClassSchema,
  startingAirportEligible: z.boolean(),
  localDemandRating: scoreSchema,
  businessDemandRating: scoreSchema,
  leisureDemandRating: scoreSchema,
  hubPotential: scoreSchema,
  gateCapacity: z.number().int().nonnegative(),
  slotPressure: scoreSchema,
  feeLevel: scoreSchema,
  commercialViability: scoreSchema,
  runwayClass: runwayClassSchema,
  partnerPresence: scoreSchema,
  competitorPresence: scoreSchema,
  region: z.string().min(1),
  marketGroup: z.string().min(1),
  notes: z.string().optional(),
  manualOverrides: z.array(z.string()).default([]),
});
export type CuratedAirport = z.infer<typeof curatedAirportSchema>;

export const aircraftManufacturerSchema = z.object({
  id: aircraftManufacturerIdSchema,
  name: z.string().min(1),
  designPhilosophy: z.string().min(1),
  strengthTags: z.array(z.string().min(1)),
  weaknessTags: z.array(z.string().min(1)),
  supportQuality: scoreSchema,
  typicalCostProfile: z.enum(["budget", "balanced", "premium"]),
  typicalReliabilityProfile: z.enum(["fragile", "standard", "rugged"]),
});
export type AircraftManufacturer = z.infer<
  typeof aircraftManufacturerSchema
>;

export const aircraftCategorySchema = z.enum([
  "founder",
  "commuter",
  "small-regional-turboprop",
  "large-regional-turboprop",
  "small-regional-jet",
  "large-regional-jet",
  "crossover-jet",
]);
export type AircraftCategory = z.infer<typeof aircraftCategorySchema>;

export const partnerCompatibilitySchema = z.enum([
  "none",
  "eligible",
  "preferred",
  "required",
]);
export type PartnerCompatibility = z.infer<
  typeof partnerCompatibilitySchema
>;

export const aircraftTypeSchema = z.object({
  id: aircraftTypeIdSchema,
  manufacturerId: aircraftManufacturerIdSchema,
  name: z.string().min(1),
  modelCode: z.string().min(1),
  category: aircraftCategorySchema,
  family: z.string().min(1),
  capacity: z.number().int().positive(),
  rangeNm: z.number().int().positive(),
  cruiseSpeedKtas: z.number().int().positive(),
  fuelBurnRating: scoreSchema,
  operatingCostRating: scoreSchema,
  maintenanceCostRating: scoreSchema,
  reliabilityRating: scoreSchema,
  comfortRating: scoreSchema,
  cargoStorageRating: scoreSchema,
  airportRunwayRequirement: runwayClassSchema,
  turnTimeMinutes: minutesSchema,
  purchasePrice: positiveMoneySchema,
  monthlyLeasePrice: positiveMoneySchema,
  deliveryTimeDays: z.number().int().nonnegative(),
  partnerCompatibility: partnerCompatibilitySchema,
  notes: z.string().optional(),
});
export type AircraftType = z.infer<typeof aircraftTypeSchema>;

export const acquisitionTypeSchema = z.enum([
  "starting-aircraft",
  "new-purchase",
  "used-purchase",
  "operating-lease",
  "wet-lease",
  "finance-lease",
  "partner-owned",
  "partner-financed",
]);
export type AcquisitionType = z.infer<typeof acquisitionTypeSchema>;

export const ownershipControlSchema = z.object({
  acquisitionType: acquisitionTypeSchema,
  legalOwner: z.enum(["player-airline", "lessor", "partner-airline"]),
  paymentResponsibleParty: z.enum([
    "player-airline",
    "partner-airline",
    "shared",
    "none",
  ]),
  operationalControl: z.enum(["player-airline", "partner-airline", "shared"]),
  partnerId: z.string().min(1).optional(),
  partnerContractId: contractIdSchema.optional(),
  restrictedToContractIds: z.array(contractIdSchema).default([]),
  canBeRetainedAfterSeparation: z.boolean(),
  buyoutPrice: positiveMoneySchema.optional(),
  mustReturnOnSeparation: z.boolean(),
});
export type OwnershipControl = z.infer<typeof ownershipControlSchema>;

export const aircraftInstanceSchema = z.object({
  id: aircraftInstanceIdSchema,
  aircraftTypeId: aircraftTypeIdSchema,
  registration: z.string().min(1),
  ageYears: z.number().nonnegative(),
  flightHours: z.number().nonnegative(),
  cycles: z.number().int().nonnegative(),
  condition: scoreSchema,
  cabinCondition: scoreSchema,
  reliabilityModifier: z.number().min(-50).max(50),
  maintenanceStatus: z.enum([
    "available",
    "inspection-due",
    "maintenance-due",
    "in-maintenance",
    "grounded",
  ]),
  ownership: ownershipControlSchema,
  monthlyPayment: positiveMoneySchema,
  residualValue: positiveMoneySchema,
  assignedBase: airportIdSchema,
  assignedScheduleId: scheduleIdSchema.optional(),
  contractRestrictions: z.array(contractIdSchema).default([]),
});
export type AircraftInstance = z.infer<typeof aircraftInstanceSchema>;

export const airlineSchema = z.object({
  id: airlineIdSchema,
  name: z.string().min(1),
  homeAirportId: airportIdSchema,
  currentPhase: careerPhaseSchema,
  cash: moneySchema,
  reputation: scoreSchema,
  credibility: scoreSchema,
  reliability: scoreSchema,
  operationalTrust: scoreSchema,
  difficulty: difficultySchema,
  simulationPaceId: simulationPaceSchema.shape.id,
  createdAt: isoDateTimeSchema,
  lastSimulatedAt: isoDateTimeSchema,
  featureUnlocks: z.array(featureUnlockIdSchema),
  activeTrackedObjectiveId: objectiveIdSchema.optional(),
  aircraftIds: z.array(aircraftInstanceIdSchema),
  routeIds: z.array(routeIdSchema),
  contractIds: z.array(contractIdSchema),
  objectiveProgressIds: z.array(objectiveProgressIdSchema),
});
export type Airline = z.infer<typeof airlineSchema>;

export const demandSummarySchema = z.object({
  localDemand: scoreSchema,
  businessDemand: scoreSchema,
  leisureDemand: scoreSchema,
  connectingDemand: scoreSchema,
});
export type DemandSummary = z.infer<typeof demandSummarySchema>;

export const routeSchema = z.object({
  id: routeIdSchema,
  originAirportId: airportIdSchema,
  destinationAirportId: airportIdSchema,
  distanceNm: z.number().positive(),
  status: z.enum(["planned", "active", "suspended", "closed"]),
  fare: positiveMoneySchema,
  demandSummary: demandSummarySchema,
  frequencySummary: z.object({
    weeklyRoundTrips: z.number().int().nonnegative(),
    targetDailyFrequency: z.number().nonnegative(),
  }),
  assignedScheduleIds: z.array(scheduleIdSchema),
  performanceHistory: z.array(
    z.object({
      periodStart: isoDateTimeSchema,
      periodEnd: isoDateTimeSchema,
      passengers: z.number().int().nonnegative(),
      revenue: moneySchema,
      reliability: scoreSchema,
    }),
  ),
  relatedContractIds: z.array(contractIdSchema),
  unlockRequirements: z.array(z.string()).default([]),
});
export type Route = z.infer<typeof routeSchema>;

export const scheduledFlightSchema = z.object({
  id: flightIdSchema,
  routeId: routeIdSchema,
  aircraftInstanceId: aircraftInstanceIdSchema,
  departureTimeLocal: z.string().regex(/^\d{2}:\d{2}$/),
  arrivalTimeLocal: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  blockTimeMinutes: minutesSchema,
  turnTimeMinutes: minutesSchema,
  daysOfOperation: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])),
  status: z.enum(["draft", "active", "paused", "maintenance-block"]),
  warnings: z.array(z.string()).default([]),
  maintenanceBlock: z
    .object({
      startsAt: isoDateTimeSchema,
      endsAt: isoDateTimeSchema,
      reason: z.string().min(1),
    })
    .optional(),
});
export type ScheduledFlight = z.infer<typeof scheduledFlightSchema>;

export const aircraftScheduleSchema = z.object({
  id: scheduleIdSchema,
  aircraftInstanceId: aircraftInstanceIdSchema,
  baseAirportId: airportIdSchema,
  flights: z.array(scheduledFlightSchema),
  status: z.enum(["draft", "active", "invalid", "paused"]),
  warnings: z.array(z.string()).default([]),
});
export type AircraftSchedule = z.infer<typeof aircraftScheduleSchema>;

export const cashTransactionSchema = z.object({
  id: z.string().min(1),
  occurredAt: isoDateTimeSchema,
  amount: moneySchema,
  category: z.enum([
    "passenger-revenue",
    "contract-payout",
    "aircraft-payment",
    "maintenance",
    "fuel",
    "staff",
    "facility",
    "penalty",
    "other",
  ]),
  memo: z.string().min(1),
  relatedAircraftId: aircraftInstanceIdSchema.optional(),
  relatedContractId: contractIdSchema.optional(),
  relatedRouteId: routeIdSchema.optional(),
});
export type CashTransaction = z.infer<typeof cashTransactionSchema>;

export const dailyFinancialSummarySchema = z.object({
  date: z.string().date(),
  revenue: moneySchema,
  expenses: moneySchema,
  profitLoss: moneySchema,
  transactions: z.array(cashTransactionSchema),
});
export type DailyFinancialSummary = z.infer<
  typeof dailyFinancialSummarySchema
>;

export const objectiveRequirementSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "carry-passengers",
    "operate-routes",
    "maintain-reliability",
    "reach-cash-reserve",
    "complete-contract",
    "review-report",
    "use-catch-up",
    "apply-for-certification",
  ]),
  targetValue: z.number().nonnegative().optional(),
  relatedContractId: contractIdSchema.optional(),
  relatedReportId: reportIdSchema.optional(),
  description: z.string().min(1),
});
export type ObjectiveRequirement = z.infer<
  typeof objectiveRequirementSchema
>;

export const objectiveRewardSchema = z.object({
  cash: positiveMoneySchema.optional(),
  reputation: z.number().int().nonnegative().optional(),
  operationalTrust: z.number().int().nonnegative().optional(),
  unlockIds: z.array(featureUnlockIdSchema).default([]),
  nextObjectiveIds: z.array(objectiveIdSchema).default([]),
});
export type ObjectiveReward = z.infer<typeof objectiveRewardSchema>;

export const careerObjectiveSchema = z.object({
  id: objectiveIdSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  phase: careerPhaseSchema,
  requirements: z.array(objectiveRequirementSchema),
  rewards: objectiveRewardSchema,
  milestoneIds: z.array(z.string().min(1)).default([]),
  visible: z.boolean(),
});
export type CareerObjective = z.infer<typeof careerObjectiveSchema>;

export const objectiveProgressSchema = z.object({
  id: objectiveProgressIdSchema,
  objectiveId: objectiveIdSchema,
  status: z.enum(["locked", "active", "complete", "failed"]),
  requirementProgress: z.record(z.string(), z.number().nonnegative()),
  startedAt: isoDateTimeSchema.optional(),
  completedAt: isoDateTimeSchema.optional(),
});
export type ObjectiveProgress = z.infer<typeof objectiveProgressSchema>;

export const milestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  achievedAt: isoDateTimeSchema.optional(),
});
export type Milestone = z.infer<typeof milestoneSchema>;

export const contractRequirementSchema = z.object({
  type: z.enum([
    "operate-route",
    "carry-passengers",
    "maintain-reliability",
    "aircraft-category",
    "airport-access",
  ]),
  description: z.string().min(1),
  targetValue: z.number().nonnegative().optional(),
  routeId: routeIdSchema.optional(),
  airportIds: z.array(airportIdSchema).default([]),
  aircraftCategory: aircraftCategorySchema.optional(),
});
export type ContractRequirement = z.infer<typeof contractRequirementSchema>;

export const contractSchema = z.object({
  id: contractIdSchema,
  type: z.enum(["private", "operational", "subsidy", "partner"]),
  title: z.string().min(1),
  client: z.string().min(1),
  sender: z.string().min(1),
  relatedRouteId: routeIdSchema.optional(),
  relatedAirportIds: z.array(airportIdSchema).default([]),
  requirements: z.array(contractRequirementSchema),
  rewards: objectiveRewardSchema,
  penalties: z.array(
    z.object({
      type: z.enum(["cash", "reputation", "operational-trust"]),
      amount: z.number().int().nonnegative(),
      description: z.string().min(1),
    }),
  ),
  deadline: isoDateTimeSchema.optional(),
  status: z.enum(["offered", "active", "complete", "failed", "expired"]),
  trackableObjectiveId: objectiveIdSchema.optional(),
  partnerAircraftRequirements: z
    .object({
      allowedOwnershipTypes: z.array(acquisitionTypeSchema),
      minimumCategory: aircraftCategorySchema.optional(),
      minimumReliability: scoreSchema.optional(),
      restrictedToPartnerFlying: z.boolean(),
    })
    .optional(),
});
export type Contract = z.infer<typeof contractSchema>;

export const inboxMessageSchema = z.object({
  id: inboxMessageIdSchema,
  sender: z.string().min(1),
  senderRole: z.enum([
    "co-founder",
    "advisor",
    "dispatch",
    "airport-office",
    "partner-airline",
    "system",
  ]),
  subject: z.string().min(1),
  body: z.string().min(1),
  category: z.enum([
    "story",
    "contract",
    "operations",
    "finance",
    "airport",
    "partner",
    "system",
  ]),
  createdAt: isoDateTimeSchema,
  read: z.boolean(),
  archived: z.boolean(),
  relatedObjectiveId: objectiveIdSchema.optional(),
  relatedContractId: contractIdSchema.optional(),
  relatedRouteId: routeIdSchema.optional(),
  relatedAircraftId: aircraftInstanceIdSchema.optional(),
  actionTarget: z
    .object({
      type: z.enum([
        "open-route-planning",
        "open-schedule-board",
        "view-contract",
        "view-report",
        "view-objective",
      ]),
      targetId: z.string().min(1).optional(),
    })
    .optional(),
  rewardUnlockId: featureUnlockIdSchema.optional(),
});
export type InboxMessage = z.infer<typeof inboxMessageSchema>;

export const operationsReportSchema = z.object({
  id: reportIdSchema,
  reportType: z.enum(["manual-period", "catch-up", "daily-summary"]),
  createdAt: isoDateTimeSchema,
  simulatedTimeRange: z.object({
    startsAt: isoDateTimeSchema,
    endsAt: isoDateTimeSchema,
  }),
  flightsOperated: z.number().int().nonnegative(),
  passengersCarried: z.number().int().nonnegative(),
  revenue: moneySchema,
  costs: moneySchema,
  profitLoss: moneySchema,
  reliability: scoreSchema,
  aircraftConditionChanges: z.array(
    z.object({
      aircraftId: aircraftInstanceIdSchema,
      conditionBefore: scoreSchema,
      conditionAfter: scoreSchema,
    }),
  ),
  contractProgress: z.array(z.string()).default([]),
  objectiveProgress: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  suggestedNextAction: z.string().min(1).optional(),
});
export type OperationsReport = z.infer<typeof operationsReportSchema>;

export const saveGameSchema = z.object({
  id: saveIdSchema,
  userId: userIdSchema,
  airline: airlineSchema,
  currentGameTime: isoDateTimeSchema,
  lastSimulatedAt: isoDateTimeSchema,
  simulationPace: simulationPaceSchema,
  knownAirportIds: z.array(airportIdSchema),
  unlockedAirportIds: z.array(airportIdSchema),
  airports: z.array(curatedAirportSchema),
  aircraftManufacturers: z.array(aircraftManufacturerSchema),
  aircraftTypes: z.array(aircraftTypeSchema),
  aircraft: z.array(aircraftInstanceSchema),
  routes: z.array(routeSchema),
  schedules: z.array(aircraftScheduleSchema),
  contracts: z.array(contractSchema),
  objectives: z.array(careerObjectiveSchema),
  objectiveProgress: z.array(objectiveProgressSchema),
  milestones: z.array(milestoneSchema).default([]),
  inboxMessages: z.array(inboxMessageSchema),
  reports: z.array(operationsReportSchema),
  featureUnlocks: z.array(featureUnlockSchema),
  trackedObjectiveId: objectiveIdSchema.optional(),
  settings: z.object({
    difficulty: difficultySchema,
    simulationPaceId: simulationPaceSchema.shape.id,
    autosaveEnabled: z.boolean(),
  }),
});
export type SaveGame = z.infer<typeof saveGameSchema>;
