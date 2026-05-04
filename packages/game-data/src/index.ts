export type DataModuleStatus = "foundation-ready";

export const dataModuleStatus: DataModuleStatus = "foundation-ready";

export const sampleSimulationPaces = [
  {
    id: "standard",
    displayName: "Standard",
    realMinutesPerGameDay: 60,
    catchUpEnabled: true,
    catchUpCapGameDays: 7,
  },
  {
    id: "manual",
    displayName: "Manual",
    realMinutesPerGameDay: 0.0001,
    catchUpEnabled: false,
  },
];

export const rawAirportSourceStub = {
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
  KMCW: {
    icao: "KMCW",
    iata: "MCW",
    name: "Mason City Municipal Airport",
    city: "Mason City",
    state: "IA",
    country: "United States",
    elevationFeet: 1214,
    latitude: 43.1578,
    longitude: -93.3313,
    timezone: "America/Chicago",
  },
};

export const curatedAirportStubs = [
  {
    ...rawAirportSourceStub.KALO,
    id: "airport:kalo",
    airportClass: "community",
    startingAirportEligible: true,
    localDemandRating: 42,
    businessDemandRating: 32,
    leisureDemandRating: 28,
    hubPotential: 18,
    gateCapacity: 2,
    slotPressure: 10,
    feeLevel: 18,
    commercialViability: 44,
    runwayClass: "standard",
    partnerPresence: 8,
    competitorPresence: 22,
    region: "Midwest",
    marketGroup: "Iowa community airports",
    notes:
      "Sample/stub curated airport: small enough for the founder story with nearby commuter markets.",
    manualOverrides: ["starting-airport-eligible"],
  },
  {
    ...rawAirportSourceStub.KMCW,
    id: "airport:kmcw",
    airportClass: "community",
    startingAirportEligible: true,
    localDemandRating: 34,
    businessDemandRating: 24,
    leisureDemandRating: 30,
    hubPotential: 12,
    gateCapacity: 1,
    slotPressure: 5,
    feeLevel: 16,
    commercialViability: 36,
    runwayClass: "standard",
    partnerPresence: 4,
    competitorPresence: 16,
    region: "Midwest",
    marketGroup: "Iowa community airports",
    notes:
      "Sample/stub curated airport: thin early route target for simple founder operations.",
    manualOverrides: [],
  },
];

export const sampleManufacturers = [
  {
    id: "manufacturer:aster",
    name: "Aster Aviation",
    designPhilosophy: "Low acquisition cost and simple systems for tiny operators.",
    strengthTags: ["affordable", "easy-to-source"],
    weaknessTags: ["basic-cabin", "moderate-reliability"],
    supportQuality: 58,
    typicalCostProfile: "budget",
    typicalReliabilityProfile: "standard",
  },
  {
    id: "manufacturer:kestrel",
    name: "Kestrel Works",
    designPhilosophy: "Rugged short-field aircraft with conservative operating economics.",
    strengthTags: ["rugged", "short-field"],
    weaknessTags: ["slower", "higher-upfront-cost"],
    supportQuality: 72,
    typicalCostProfile: "balanced",
    typicalReliabilityProfile: "rugged",
  },
];

export const sampleAircraftTypes = [
  {
    id: "aircraft-type:aster-a8-courier",
    manufacturerId: "manufacturer:aster",
    name: "Aster A-8 Courier",
    modelCode: "A-8",
    category: "founder",
    family: "Aster light utility",
    capacity: 8,
    rangeNm: 320,
    cruiseSpeedKtas: 155,
    fuelBurnRating: 68,
    operatingCostRating: 78,
    maintenanceCostRating: 62,
    reliabilityRating: 55,
    comfortRating: 32,
    cargoStorageRating: 38,
    airportRunwayRequirement: "short",
    turnTimeMinutes: 25,
    purchasePrice: 420000,
    monthlyLeasePrice: 8500,
    deliveryTimeDays: 0,
    partnerCompatibility: "none",
    notes: "Cheap starter aircraft with little room for mistakes.",
  },
  {
    id: "aircraft-type:kestrel-k10-trail",
    manufacturerId: "manufacturer:kestrel",
    name: "Kestrel K-10 Trail",
    modelCode: "K-10",
    category: "founder",
    family: "Kestrel trail",
    capacity: 10,
    rangeNm: 360,
    cruiseSpeedKtas: 145,
    fuelBurnRating: 62,
    operatingCostRating: 70,
    maintenanceCostRating: 66,
    reliabilityRating: 70,
    comfortRating: 40,
    cargoStorageRating: 48,
    airportRunwayRequirement: "short",
    turnTimeMinutes: 30,
    purchasePrice: 560000,
    monthlyLeasePrice: 11200,
    deliveryTimeDays: 0,
    partnerCompatibility: "eligible",
    notes: "More expensive starter aircraft with rugged airport performance.",
  },
];

export const sampleAircraft = [
  {
    id: "aircraft:nc101as",
    aircraftTypeId: "aircraft-type:aster-a8-courier",
    registration: "NC-101AS",
    ageYears: 11,
    flightHours: 3100,
    cycles: 1850,
    condition: 78,
    cabinCondition: 62,
    reliabilityModifier: -4,
    maintenanceStatus: "available",
    ownership: {
      acquisitionType: "starting-aircraft",
      legalOwner: "player-airline",
      paymentResponsibleParty: "player-airline",
      operationalControl: "player-airline",
      restrictedToContractIds: [],
      canBeRetainedAfterSeparation: true,
      mustReturnOnSeparation: false,
    },
    monthlyPayment: 0,
    residualValue: 260000,
    assignedBase: "airport:kalo",
    assignedScheduleId: "schedule:nc101as-weekly",
    contractRestrictions: [],
  },
];

export const sampleRoutes = [
  {
    id: "route:kalo-kmcw",
    originAirportId: "airport:kalo",
    destinationAirportId: "airport:kmcw",
    distanceNm: 84,
    status: "active",
    fare: 95,
    demandSummary: {
      localDemand: 34,
      businessDemand: 20,
      leisureDemand: 28,
      connectingDemand: 0,
    },
    frequencySummary: {
      weeklyRoundTrips: 5,
      targetDailyFrequency: 1,
    },
    assignedScheduleIds: ["schedule:nc101as-weekly"],
    performanceHistory: [],
    relatedContractIds: ["contract:weekend-community-shuttle"],
    unlockRequirements: ["founder route authority"],
  },
];

export const sampleSchedules = [
  {
    id: "schedule:nc101as-weekly",
    aircraftInstanceId: "aircraft:nc101as",
    baseAirportId: "airport:kalo",
    flights: [
      {
        id: "flight:kalo-kmcw-morning",
        routeId: "route:kalo-kmcw",
        aircraftInstanceId: "aircraft:nc101as",
        departureTimeLocal: "08:00",
        arrivalTimeLocal: "08:45",
        blockTimeMinutes: 45,
        turnTimeMinutes: 30,
        daysOfOperation: ["mon", "tue", "wed", "thu", "fri"],
        status: "active",
        warnings: [],
      },
    ],
    status: "active",
    warnings: [],
  },
];

export const sampleFeatureUnlocks = [
  {
    id: "unlock:operations-report",
    name: "Operations Report",
    description: "Review the result of completed operating periods.",
  },
];

export const sampleObjectives = [
  {
    id: "objective:operate-first-route",
    title: "Operate the First Route",
    description: "Run a simple founder route and prove the airline can move passengers.",
    phase: "founder-operator",
    requirements: [
      {
        id: "passengers",
        type: "carry-passengers",
        targetValue: 6,
        description: "Carry at least six passengers.",
      },
      {
        id: "report",
        type: "review-report",
        description: "Review the first operations report.",
      },
    ],
    rewards: {
      reputation: 2,
      operationalTrust: 3,
      unlockIds: ["unlock:operations-report"],
      nextObjectiveIds: [],
    },
    milestoneIds: [],
    visible: true,
  },
];

export const sampleObjectiveProgress = [
  {
    id: "objective-progress:operate-first-route",
    objectiveId: "objective:operate-first-route",
    status: "active",
    requirementProgress: {
      passengers: 0,
      report: 0,
    },
    startedAt: "2026-05-04T08:00:00.000-05:00",
  },
];

export const sampleContracts = [
  {
    id: "contract:weekend-community-shuttle",
    type: "private",
    title: "Weekend Community Shuttle",
    client: "Mason City Community Airport Office",
    sender: "Community Airport Office",
    relatedRouteId: "route:kalo-kmcw",
    relatedAirportIds: ["airport:kalo", "airport:kmcw"],
    requirements: [
      {
        type: "operate-route",
        description: "Operate the Waterloo to Mason City shuttle.",
        targetValue: 2,
        routeId: "route:kalo-kmcw",
      },
      {
        type: "maintain-reliability",
        description: "Keep reliability at or above 80 during the contract.",
        targetValue: 80,
      },
    ],
    rewards: {
      cash: 12000,
      reputation: 1,
      unlockIds: [],
      nextObjectiveIds: [],
    },
    penalties: [
      {
        type: "cash",
        amount: 3500,
        description: "Missed service penalty.",
      },
    ],
    deadline: "2026-05-11T23:59:59.000-05:00",
    status: "offered",
    trackableObjectiveId: "objective:operate-first-route",
  },
];

export const sampleInboxMessages = [
  {
    id: "message:first-route-first-risk",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "First route, first risk",
    body: "One aircraft means one bad schedule can ruin the day. Keep the first route short and repeatable.",
    category: "story",
    createdAt: "2026-05-04T08:05:00.000-05:00",
    read: false,
    archived: false,
    relatedObjectiveId: "objective:operate-first-route",
    relatedRouteId: "route:kalo-kmcw",
    actionTarget: {
      type: "open-schedule-board",
      targetId: "schedule:nc101as-weekly",
    },
  },
];

export const sampleReports = [
  {
    id: "report:first-operating-period",
    reportType: "manual-period",
    createdAt: "2026-05-04T10:00:00.000-05:00",
    simulatedTimeRange: {
      startsAt: "2026-05-04T08:00:00.000-05:00",
      endsAt: "2026-05-04T10:00:00.000-05:00",
    },
    flightsOperated: 0,
    passengersCarried: 0,
    revenue: 0,
    costs: 0,
    profitLoss: 0,
    reliability: 100,
    aircraftConditionChanges: [],
    contractProgress: [],
    objectiveProgress: [],
    warnings: [],
    suggestedNextAction: "Run the first scheduled flight.",
  },
];

export const sampleAirline = {
  id: "airline:cedar-valley-air",
  name: "Cedar Valley Air",
  homeAirportId: "airport:kalo",
  currentPhase: "founder-operator",
  cash: 125000,
  reputation: 5,
  credibility: 4,
  reliability: 100,
  operationalTrust: 3,
  difficulty: "standard",
  simulationPaceId: "standard",
  createdAt: "2026-05-04T08:00:00.000-05:00",
  lastSimulatedAt: "2026-05-04T08:00:00.000-05:00",
  featureUnlocks: ["unlock:operations-report"],
  activeTrackedObjectiveId: "objective:operate-first-route",
  aircraftIds: ["aircraft:nc101as"],
  routeIds: ["route:kalo-kmcw"],
  contractIds: ["contract:weekend-community-shuttle"],
  objectiveProgressIds: ["objective-progress:operate-first-route"],
};

export const sampleSaveGame = {
  id: "save:cedar-valley-act1",
  userId: "user:local-founder",
  airline: sampleAirline,
  currentGameTime: "2026-05-04T08:00:00.000-05:00",
  lastSimulatedAt: "2026-05-04T08:00:00.000-05:00",
  simulationPace: sampleSimulationPaces[0],
  knownAirportIds: ["airport:kalo", "airport:kmcw"],
  unlockedAirportIds: ["airport:kalo", "airport:kmcw"],
  airports: curatedAirportStubs,
  aircraftManufacturers: sampleManufacturers,
  aircraftTypes: sampleAircraftTypes,
  aircraft: sampleAircraft,
  routes: sampleRoutes,
  schedules: sampleSchedules,
  contracts: sampleContracts,
  objectives: sampleObjectives,
  objectiveProgress: sampleObjectiveProgress,
  milestones: [],
  inboxMessages: sampleInboxMessages,
  reports: sampleReports,
  featureUnlocks: sampleFeatureUnlocks,
  trackedObjectiveId: "objective:operate-first-route",
  settings: {
    difficulty: "standard",
    simulationPaceId: "standard",
    autosaveEnabled: true,
  },
};
