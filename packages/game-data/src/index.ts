import { buildAirportPipelineFromValidated, validateCuratedAirportExport } from "./airportPipeline";

export * from "./actOneContent";
export type DataModuleStatus = "foundation-ready";

export const dataModuleStatus: DataModuleStatus = "foundation-ready";

export * from "./airportPipeline";

export const sampleSimulationPaces = [
  {
    id: "manual",
    displayName: "Manual",
    realMinutesPerGameDay: 0.0001,
    catchUpEnabled: false
  },
  {
    id: "slow",
    displayName: "Slow",
    realMinutesPerGameDay: 120,
    catchUpEnabled: true,
    catchUpCapGameDays: 3
  },
  {
    id: "standard",
    displayName: "Standard",
    realMinutesPerGameDay: 60,
    catchUpEnabled: true,
    catchUpCapGameDays: 7
  },
  {
    id: "fast",
    displayName: "Fast",
    realMinutesPerGameDay: 30,
    catchUpEnabled: true,
    catchUpCapGameDays: 14
  }
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
    timezone: "America/Chicago"
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
    timezone: "America/Chicago"
  }
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
    runwayClass: "small",
    partnerPresence: 8,
    competitorPresence: 22,
    region: "Midwest",
    marketGroup: "Iowa community airports",
    notes:
      "Sample/stub curated airport: small enough for the founder story with nearby commuter markets.",
    manualOverrides: ["starting-airport-eligible"]
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
    runwayClass: "small",
    partnerPresence: 4,
    competitorPresence: 16,
    region: "Midwest",
    marketGroup: "Iowa community airports",
    notes: "Sample/stub curated airport: thin early route target for simple founder operations.",
    manualOverrides: []
  }
];

/**
 * Maps the detailed curated runway class to the broader aircraft capability class for test fixtures.
 *
 * @param runwayClass - The specific curated runway class (e.g., 'small', 'medium').
 * @returns The general capability class for aircraft assignment (e.g., 'short', 'regional').
 */
export const mapStarterRunwayClass = (runwayClass: string) => {
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
      return "standard";
  }
};

export const sampleSaveAirports = curatedAirportStubs.map((airport) => ({
  ...airport,
  runwayClass: mapStarterRunwayClass(airport.runwayClass)
}));

const starterAirportCuratedExport = validateCuratedAirportExport(
  curatedAirportStubs.reduce<Record<string, unknown>>((records, airport) => {
    records[airport.icao] = {
      ...airport,
      curationStatus: "reviewed",
      marketArea: airport.marketGroup,
      airportScale: airport.airportClass,
      airportUseType: "municipal",
      hasCommercialService: true,
      hasInternationalService: false,
      isCargoRelevant: false,
      isMilitary: false,
      terrainContext: "flat",
      remoteness: "rural"
    };
    return records;
  }, {})
).airports;

export const difficultyPresets = [
  {
    id: "easy",
    displayName: "Easy",
    startingCash: 180000,
    maintenanceForgiveness: 15,
    fuelCostMultiplier: 0.9,
    reputationForgiveness: 10
  },
  {
    id: "standard",
    displayName: "Standard",
    startingCash: 125000,
    maintenanceForgiveness: 0,
    fuelCostMultiplier: 1,
    reputationForgiveness: 0
  },
  {
    id: "hard",
    displayName: "Hard",
    startingCash: 90000,
    maintenanceForgiveness: -5,
    fuelCostMultiplier: 1.08,
    reputationForgiveness: -5
  },
  {
    id: "realistic",
    displayName: "Realistic",
    startingCash: 75000,
    maintenanceForgiveness: -10,
    fuelCostMultiplier: 1.15,
    reputationForgiveness: -10
  }
] as const;

export const starterAirportPipeline = buildAirportPipelineFromValidated(
  rawAirportSourceStub,
  starterAirportCuratedExport,
  {
    includeUnreviewed: true
  }
);

export const starterAirports = starterAirportPipeline.airports;

/**
 * Catalog of fictional aircraft manufacturers.
 * Each manufacturer has a distinct design philosophy, strengths, weaknesses, and cost/reliability profiles.
 *
 * @type {readonly {
 *   id: string,
 *   name: string,
 *   designPhilosophy: string,
 *   strengthTags: string[],
 *   weaknessTags: string[],
 *   supportQuality: number,
 *   typicalCostProfile: "budget" | "balanced" | "premium",
 *   typicalReliabilityProfile: "fragile" | "standard" | "rugged"
 * }[]}
 */
export const aircraftManufacturers = [
  {
    id: "manufacturer:aster",
    name: "Aster Aviation",
    designPhilosophy:
      "Affordable, simple aircraft that help cash-starved founders get flying early.",
    strengthTags: ["low-purchase-price", "simple-systems", "good-used-availability"],
    weaknessTags: ["lower-comfort", "higher-condition-risk", "modest-support"],
    supportQuality: 58,
    typicalCostProfile: "budget",
    typicalReliabilityProfile: "fragile"
  },
  {
    id: "manufacturer:kestrel",
    name: "Kestrel Aircraft Works",
    designPhilosophy:
      "Rugged aircraft for small airports, conservative operators, and difficult early routes.",
    strengthTags: ["rugged", "short-field", "strong-reliability"],
    weaknessTags: ["slower", "higher-upfront-cost", "plain-cabins"],
    supportQuality: 72,
    typicalCostProfile: "balanced",
    typicalReliabilityProfile: "rugged"
  },
  {
    id: "manufacturer:hawthorne",
    name: "Hawthorne Aeronautics",
    designPhilosophy:
      "Polished regional aircraft with strong passenger appeal and partner-airline credibility.",
    strengthTags: ["comfort", "partner-ready", "support-network"],
    weaknessTags: ["premium-pricing", "higher-lease-pressure"],
    supportQuality: 84,
    typicalCostProfile: "premium",
    typicalReliabilityProfile: "standard"
  },
  {
    id: "manufacturer:vela",
    name: "Vela Aerospace",
    designPhilosophy:
      "Modern efficient aircraft with good range and operating economics, but newer support risks.",
    strengthTags: ["efficient", "longer-range", "modern-cabins"],
    weaknessTags: ["delivery-waits", "newer-support-network"],
    supportQuality: 68,
    typicalCostProfile: "balanced",
    typicalReliabilityProfile: "standard"
  }
];

/**
 * Canonical catalog of aircraft types available in the game.
 *
 * Each entry defines the technical specifications, economic profiles, and gameplay roles
 * for a specific aircraft model.
 *
 * Object Properties:
 * - `id`: Branded unique identifier for the aircraft type.
 * - `manufacturerId`: Reference to the manufacturer catalog.
 * - `name`: Display name of the aircraft.
 * - `modelCode`: Technical ICAO-style model code.
 * - `category`: Gameplay tier (e.g., founder, commuter, regional-jet).
 * - `family`: Family grouping for maintenance and training commonality.
 * - `capacity`: Passenger seating capacity.
 * - `rangeNm`: Operational range in nautical miles.
 * - `cruiseSpeedKtas: Speed in knots true airspeed.
 * - `fuelBurnRating`: Relative fuel efficiency score.
 * - `operatingCostRating`: Relative hourly operating cost score.
 * - `maintenanceCostRating`: Relative maintenance cost score.
 * - `reliabilityRating`: Base reliability score.
 * - `comfortRating`: Passenger comfort/cabin quality score.
 * - `cargoStorageRating`: Relative cargo/baggage capacity score.
 * - `airportRunwayRequirement`: Minimum {@link RunwayClass} required.
 * - `turnTimeMinutes`: Minimum ground time required between flights.
 * - `purchasePrice`: Cost to buy new in game currency.
 * - `monthlyLeasePrice`: Base monthly cost for an operating lease.
 * - `deliveryTimeDays`: Wait time for new aircraft delivery.
 * - `partnerCompatibility`: Eligibility for partner-airline operations.
 * - `notes`: Flavor text and gameplay tips.
 * - `act1Allowed`: (Optional) Whether available during the founder phase.
 * - `starterAircraft`: (Optional) Whether selectable as a starting airframe.
 * - `starterProfile`: (Optional) Pre-defined wear-and-tear for starting instances.
 */
export const aircraftTypes = [
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
    act1Allowed: true,
    starterAircraft: true,
    starterProfile: {
      ageYears: 12,
      flightHours: 3200,
      cycles: 1850,
      condition: 78,
      cabinCondition: 62,
      reliabilityModifier: -5
    }
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
    act1Allowed: true,
    starterAircraft: true,
    starterProfile: {
      ageYears: 8,
      flightHours: 2400,
      cycles: 1500,
      condition: 86,
      cabinCondition: 72,
      reliabilityModifier: 2
    }
  },
  {
    id: "aircraft-type:aster-a19-commuter",
    manufacturerId: "manufacturer:aster",
    name: "Aster A-19 Commuter",
    modelCode: "A-19",
    category: "commuter",
    family: "Aster commuter",
    capacity: 19,
    rangeNm: 430,
    cruiseSpeedKtas: 178,
    fuelBurnRating: 66,
    operatingCostRating: 74,
    maintenanceCostRating: 58,
    reliabilityRating: 58,
    comfortRating: 42,
    cargoStorageRating: 44,
    airportRunwayRequirement: "standard",
    turnTimeMinutes: 32,
    purchasePrice: 1280000,
    monthlyLeasePrice: 24500,
    deliveryTimeDays: 35,
    partnerCompatibility: "eligible",
    notes: "Low-cost step into scheduled commuter service.",
    act1Allowed: true
  },
  {
    id: "aircraft-type:kestrel-k19-harbor",
    manufacturerId: "manufacturer:kestrel",
    name: "Kestrel K-19 Harbor",
    modelCode: "K-19",
    category: "commuter",
    family: "Kestrel harbor",
    capacity: 19,
    rangeNm: 390,
    cruiseSpeedKtas: 168,
    fuelBurnRating: 61,
    operatingCostRating: 68,
    maintenanceCostRating: 70,
    reliabilityRating: 74,
    comfortRating: 45,
    cargoStorageRating: 56,
    airportRunwayRequirement: "short",
    turnTimeMinutes: 34,
    purchasePrice: 1520000,
    monthlyLeasePrice: 28600,
    deliveryTimeDays: 42,
    partnerCompatibility: "eligible",
    notes: "Rugged commuter aircraft for thin routes and rougher airports.",
    act1Allowed: true
  },
  {
    id: "aircraft-type:kestrel-k32-range",
    manufacturerId: "manufacturer:kestrel",
    name: "Kestrel K-32 Range",
    modelCode: "K-32",
    category: "small-regional-turboprop",
    family: "Kestrel range",
    capacity: 32,
    rangeNm: 610,
    cruiseSpeedKtas: 220,
    fuelBurnRating: 63,
    operatingCostRating: 66,
    maintenanceCostRating: 72,
    reliabilityRating: 76,
    comfortRating: 52,
    cargoStorageRating: 60,
    airportRunwayRequirement: "standard",
    turnTimeMinutes: 38,
    purchasePrice: 4200000,
    monthlyLeasePrice: 76000,
    deliveryTimeDays: 70,
    partnerCompatibility: "preferred",
    notes: "Dependable small turboprop with enough range for early regional growth."
  },
  {
    id: "aircraft-type:vela-v34-nova",
    manufacturerId: "manufacturer:vela",
    name: "Vela V-34 Nova",
    modelCode: "V-34",
    category: "small-regional-turboprop",
    family: "Vela Nova",
    capacity: 34,
    rangeNm: 690,
    cruiseSpeedKtas: 238,
    fuelBurnRating: 74,
    operatingCostRating: 72,
    maintenanceCostRating: 62,
    reliabilityRating: 68,
    comfortRating: 58,
    cargoStorageRating: 52,
    airportRunwayRequirement: "regional",
    turnTimeMinutes: 36,
    purchasePrice: 4650000,
    monthlyLeasePrice: 82000,
    deliveryTimeDays: 95,
    partnerCompatibility: "preferred",
    notes: "Efficient and modern, but less forgiving at constrained airports."
  },
  {
    id: "aircraft-type:kestrel-k52-mesa",
    manufacturerId: "manufacturer:kestrel",
    name: "Kestrel K-52 Mesa",
    modelCode: "K-52",
    category: "large-regional-turboprop",
    family: "Kestrel mesa",
    capacity: 52,
    rangeNm: 760,
    cruiseSpeedKtas: 252,
    fuelBurnRating: 64,
    operatingCostRating: 65,
    maintenanceCostRating: 73,
    reliabilityRating: 78,
    comfortRating: 56,
    cargoStorageRating: 66,
    airportRunwayRequirement: "regional",
    turnTimeMinutes: 42,
    purchasePrice: 8500000,
    monthlyLeasePrice: 142000,
    deliveryTimeDays: 110,
    partnerCompatibility: "preferred",
    notes: "Workhorse feeder turboprop with strong reliability and cargo room."
  },
  {
    id: "aircraft-type:hawthorne-h56-connector",
    manufacturerId: "manufacturer:hawthorne",
    name: "Hawthorne H-56 Connector",
    modelCode: "H-56",
    category: "large-regional-turboprop",
    family: "Hawthorne Connector",
    capacity: 56,
    rangeNm: 720,
    cruiseSpeedKtas: 266,
    fuelBurnRating: 58,
    operatingCostRating: 57,
    maintenanceCostRating: 68,
    reliabilityRating: 72,
    comfortRating: 70,
    cargoStorageRating: 54,
    airportRunwayRequirement: "regional",
    turnTimeMinutes: 40,
    purchasePrice: 9700000,
    monthlyLeasePrice: 166000,
    deliveryTimeDays: 125,
    partnerCompatibility: "preferred",
    notes: "More comfortable partner-facing turboprop with higher cost pressure."
  },
  {
    id: "aircraft-type:aster-aj44-swift",
    manufacturerId: "manufacturer:aster",
    name: "Aster AJ-44 Swift",
    modelCode: "AJ-44",
    category: "small-regional-jet",
    family: "Aster Swift",
    capacity: 44,
    rangeNm: 980,
    cruiseSpeedKtas: 420,
    fuelBurnRating: 46,
    operatingCostRating: 50,
    maintenanceCostRating: 52,
    reliabilityRating: 60,
    comfortRating: 60,
    cargoStorageRating: 40,
    airportRunwayRequirement: "regional",
    turnTimeMinutes: 44,
    purchasePrice: 12300000,
    monthlyLeasePrice: 214000,
    deliveryTimeDays: 150,
    partnerCompatibility: "eligible",
    notes: "Lower-cost regional jet that trades polish for earlier jet access."
  },
  {
    id: "aircraft-type:hawthorne-hj48-link",
    manufacturerId: "manufacturer:hawthorne",
    name: "Hawthorne HJ-48 Link",
    modelCode: "HJ-48",
    category: "small-regional-jet",
    family: "Hawthorne Link",
    capacity: 48,
    rangeNm: 1050,
    cruiseSpeedKtas: 438,
    fuelBurnRating: 52,
    operatingCostRating: 45,
    maintenanceCostRating: 66,
    reliabilityRating: 73,
    comfortRating: 78,
    cargoStorageRating: 45,
    airportRunwayRequirement: "mainline",
    turnTimeMinutes: 46,
    purchasePrice: 14800000,
    monthlyLeasePrice: 252000,
    deliveryTimeDays: 165,
    partnerCompatibility: "preferred",
    notes: "Partner-friendly small jet with comfort and reliability advantages."
  },
  {
    id: "aircraft-type:hawthorne-hj72-bridge",
    manufacturerId: "manufacturer:hawthorne",
    name: "Hawthorne HJ-72 Bridge",
    modelCode: "HJ-72",
    category: "large-regional-jet",
    family: "Hawthorne Bridge",
    capacity: 72,
    rangeNm: 1350,
    cruiseSpeedKtas: 446,
    fuelBurnRating: 50,
    operatingCostRating: 42,
    maintenanceCostRating: 68,
    reliabilityRating: 74,
    comfortRating: 80,
    cargoStorageRating: 58,
    airportRunwayRequirement: "mainline",
    turnTimeMinutes: 52,
    purchasePrice: 23500000,
    monthlyLeasePrice: 382000,
    deliveryTimeDays: 190,
    partnerCompatibility: "preferred",
    notes: "Large regional jet built for affiliate flying and business-heavy routes."
  },
  {
    id: "aircraft-type:vela-vj86-arc",
    manufacturerId: "manufacturer:vela",
    name: "Vela VJ-86 Arc",
    modelCode: "VJ-86",
    category: "large-regional-jet",
    family: "Vela Arc",
    capacity: 86,
    rangeNm: 1480,
    cruiseSpeedKtas: 452,
    fuelBurnRating: 62,
    operatingCostRating: 55,
    maintenanceCostRating: 58,
    reliabilityRating: 68,
    comfortRating: 72,
    cargoStorageRating: 62,
    airportRunwayRequirement: "mainline",
    turnTimeMinutes: 56,
    purchasePrice: 25800000,
    monthlyLeasePrice: 410000,
    deliveryTimeDays: 220,
    partnerCompatibility: "preferred",
    notes: "Efficient high-capacity regional jet with delivery and support tradeoffs."
  }
];

/**
 * List of starter aircraft type IDs available to new players.
 * This is a maintained list of strings used for default loadouts or tutorials.
 */
export const starterAircraftTypeIds = [
  "aircraft-type:aster-a8-courier",
  "aircraft-type:kestrel-k10-trail"
];

export const sampleManufacturers = aircraftManufacturers;
export const sampleAircraftTypes = aircraftTypes;

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
      mustReturnOnSeparation: false
    },
    monthlyPayment: 0,
    residualValue: 260000,
    assignedBase: "airport:kalo",
    assignedScheduleId: "schedule:nc101as-weekly",
    contractRestrictions: []
  }
];

export const sampleRoutes = [
  {
    id: "route:kalo-kmcw",
    airlineId: "airline:northfield-air-service",
    originAirportId: "airport:kalo",
    destinationAirportId: "airport:kmcw",
    distanceNm: 84,
    status: "active",
    routeType: "scheduled",
    fare: 95,
    demandSummary: {
      localDemand: 34,
      businessDemand: 20,
      leisureDemand: 28,
      connectingDemand: 0
    },
    marketPlaceholder: {
      localPassengerInterest: 34,
      businessTravelShare: 20,
      leisureTravelShare: 28,
      demandConfidence: 45,
      notes: "Starter fixture market placeholder only.",
      marketSource: "fixture"
    },
    frequencySummary: {
      weeklyRoundTrips: 5,
      targetDailyFrequency: 1
    },
    assignedScheduleIds: ["schedule:nc101as-weekly"],
    performanceHistory: [],
    relatedContractIds: ["contract:weekend-community-shuttle"],
    unlockRequirements: ["founder route authority"],
    createdAt: "2026-05-04T08:00:00.000-05:00"
  }
];

export const sampleSchedules = [
  {
    id: "schedule:nc101as-weekly",
    airlineId: "airline:northfield-air-service",
    aircraftInstanceId: "aircraft:nc101as",
    baseAirportId: "airport:kalo",
    flights: [
      {
        id: "flight:kalo-kmcw-morning",
        routeId: "route:kalo-kmcw",
        aircraftInstanceId: "aircraft:nc101as",
        originAirportId: "airport:kalo",
        destinationAirportId: "airport:kmcw",
        departureTimeLocal: "08:00",
        arrivalTimeLocal: "08:45",
        blockTimeMinutes: 45,
        turnTimeMinutes: 30,
        daysOfOperation: ["mon", "tue", "wed", "thu", "fri"],
        status: "active",
        warnings: []
      }
    ],
    status: "active",
    warnings: []
  }
];

export const goal07DeveloperFixtures = {
  starterAirports: sampleSaveAirports.slice(0, 2),
  starterAircraft: sampleAircraft[0],
  validStarterRoute: sampleRoutes[0],
  invalidStarterRoutePlan: {
    originAirportId: "airport:kalo",
    destinationAirportId: "airport:kalo",
    aircraftInstanceId: "aircraft:nc101as"
  },
  validRoundTrip: {
    aircraftInstanceId: "aircraft:nc101as",
    routeId: "route:kalo-kmcw",
    firstDepartureTimeLocal: "08:00",
    turnTimeMinutes: 30
  },
  invalidOverlappingSchedule: {
    aircraftInstanceId: "aircraft:nc101as",
    routeId: "route:kalo-kmcw",
    departureTimeLocal: "08:15",
    turnTimeMinutes: 30
  }
} as const;

export const sampleFeatureUnlocks = [
  {
    id: "unlock:operations-report",
    name: "Operations Report",
    description: "Review the result of completed operating periods."
  }
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
        description: "Carry at least six passengers."
      },
      {
        id: "report",
        type: "review-report",
        description: "Review the first operations report."
      }
    ],
    rewards: {
      reputation: 2,
      operationalTrust: 3,
      unlockIds: ["unlock:operations-report"],
      nextObjectiveIds: []
    },
    milestoneIds: [],
    visible: true
  }
];

export const sampleObjectiveProgress = [
  {
    id: "objective-progress:operate-first-route",
    objectiveId: "objective:operate-first-route",
    status: "active",
    requirementProgress: {
      passengers: 0,
      report: 0
    },
    startedAt: "2026-05-04T08:00:00.000-05:00"
  }
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
        routeId: "route:kalo-kmcw"
      },
      {
        type: "maintain-reliability",
        description: "Keep reliability at or above 80 during the contract.",
        targetValue: 80
      }
    ],
    rewards: {
      cash: 12000,
      reputation: 1,
      unlockIds: [],
      nextObjectiveIds: []
    },
    penalties: [
      {
        type: "cash",
        amount: 3500,
        description: "Missed service penalty."
      }
    ],
    deadline: "2026-05-11T23:59:59.000-05:00",
    status: "offered",
    trackableObjectiveId: "objective:operate-first-route"
  }
];

export const sampleInboxMessages = [
  {
    id: "message:welcome-to-cedar-valley",
    sender: "System",
    senderRole: "system",
    subject: "Welcome to Cedar Valley Air",
    body: "Your new airline is set up. Start with a short, dependable route and keep the first aircraft close to home.",
    category: "system",
    createdAt: "2026-05-04T08:01:00.000-05:00",
    read: false,
    archived: false,
    storyTags: ["act1", "setup"],
    actionTarget: {
      type: "view-objective",
      targetId: "objective:operate-first-route"
    }
  },
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
    storyTags: ["act1", "route-planning"],
    relatedObjectiveId: "objective:operate-first-route",
    actionTarget: {
      type: "open-route-planning"
    }
  },
  {
    id: "message:setup-checklist",
    sender: "Dispatch",
    senderRole: "dispatch",
    subject: "Setup checklist",
    body: "Pick a starter airport, confirm the aircraft assignment, and leave the clock paused until you are ready to run the first day.",
    category: "operations",
    createdAt: "2026-05-04T08:07:00.000-05:00",
    read: false,
    archived: false,
    storyTags: ["act1", "setup"],
    actionTarget: {
      type: "open-route-planning"
    }
  },
  {
    id: "message:objective-hint",
    sender: "Maya Reyes",
    senderRole: "co-founder",
    subject: "What we need first",
    body: "Operate the first route, review the report, then keep the schedule boring enough that reliability becomes a habit.",
    category: "story",
    createdAt: "2026-05-04T08:10:00.000-05:00",
    read: false,
    archived: false,
    storyTags: ["act1", "objective"],
    relatedObjectiveId: "objective:operate-first-route",
    actionTarget: {
      type: "view-objective",
      targetId: "objective:operate-first-route"
    }
  }
];

export const sampleReports = [
  {
    id: "report:first-operating-period",
    reportType: "manual-period",
    createdAt: "2026-05-04T10:00:00.000-05:00",
    simulatedTimeRange: {
      startsAt: "2026-05-04T08:00:00.000-05:00",
      endsAt: "2026-05-04T10:00:00.000-05:00"
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
    suggestedNextAction: "Run the first scheduled flight."
  }
];

export const sampleFounderProfile = {
  id: "founder:local-founder",
  name: "Local Founder",
  backgroundArchetype: "bootstrap-operator",
  reputationModifier: 0,
  financeModifier: 0
};

export const sampleSimulationConfig = {
  simulationPaceId: "standard",
  difficulty: "standard",
  createdAt: "2026-05-04T08:00:00.000-05:00",
  lastPlayedAt: "2026-05-04T08:00:00.000-05:00",
  currentGameTime: "2026-05-04T08:00:00.000-05:00",
  paused: true
};

export const sampleFinanceState = {
  currentCash: 125000,
  startingLoanBalance: 0,
  recurringObligations: [
    {
      id: "obligation:maintenance-reserve",
      label: "Maintenance reserve",
      amount: 15000,
      cadence: "monthly"
    }
  ],
  maintenanceReserve: 15000,
  transactionHistory: []
};

export const sampleObjectiveState = {
  trackedObjectiveId: "objective:operate-first-route",
  activeObjectiveIds: ["objective:operate-first-route"],
  completedObjectiveIds: [],
  objectiveProgressIds: ["objective-progress:operate-first-route"],
  actId: "act1",
  chapterId: "founder-operator",
  storyFlags: ["act1-started"]
};

export const sampleStoryState = {
  currentAct: "act1",
  currentChapter: "founder-operator",
  flags: ["act1-started"],
  majorDecisions: [],
  partnerRelationships: []
};

export const sampleInboxState = {
  messageIds: sampleInboxMessages.map((message) => message.id),
  unreadMessageIds: sampleInboxMessages
    .filter((message) => !message.read)
    .map((message) => message.id),
  lastInboxSyncAt: "2026-05-04T08:10:00.000-05:00"
};

export const sampleAirline = {
  id: "airline:cedar-valley-air",
  name: "Cedar Valley Air",
  shortName: "Cedar Valley",
  callsign: "CEDAR VALLEY",
  code: "CVA",
  founderName: sampleFounderProfile.name,
  foundedAt: "2026-05-04T08:00:00.000-05:00",
  homeAirportId: "airport:kalo",
  primaryMarketArea: "Cedar Valley / Waterloo",
  brandingSeed: "cedar-valley-air:airport:kalo:founder:local-founder",
  status: "active",
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
  featureUnlocks: [],
  activeTrackedObjectiveId: "objective:operate-first-route",
  aircraftIds: ["aircraft:nc101as"],
  routeIds: ["route:kalo-kmcw"],
  contractIds: ["contract:weekend-community-shuttle"],
  objectiveProgressIds: ["objective-progress:operate-first-route"]
};

export const sampleSaveGame = {
  id: "save:cedar-valley-act1",
  userId: "user:local-founder",
  founderProfile: sampleFounderProfile,
  airline: sampleAirline,
  simulationConfig: sampleSimulationConfig,
  currentGameTime: "2026-05-04T08:00:00.000-05:00",
  lastSimulatedAt: "2026-05-04T08:00:00.000-05:00",
  simulationPace: sampleSimulationPaces[2],
  financeState: sampleFinanceState,
  knownAirportIds: ["airport:kalo", "airport:kmcw"],
  unlockedAirportIds: ["airport:kalo", "airport:kmcw"],
  airports: sampleSaveAirports,
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
  inboxState: sampleInboxState,
  reports: [],
  featureUnlocks: [],
  trackedObjectiveId: "objective:operate-first-route",
  objectiveState: sampleObjectiveState,
  storyState: sampleStoryState,
  settings: {
    difficulty: "standard",
    simulationPaceId: "standard",
    autosaveEnabled: true
  }
};

export const goal07StarterSaveFixture = sampleSaveGame;
