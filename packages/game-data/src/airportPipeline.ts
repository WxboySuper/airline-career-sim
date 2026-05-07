import { readFile } from "node:fs/promises";
import {
  type AirportId,
  type RawAirportEntry,
  type RawAirportSource,
  airportIdSchema,
  rawAirportEntrySchema
} from "@airline-career-sim/shared";

export const defaultReviewedAirportExportPath = "data/curated/airports.us.reviewed.json";
export const defaultPreliminaryCuratedAirportExportPath = "data/curated/airports.json";

export const curationStatuses = [
  "unreviewed",
  "partial",
  "reviewed",
  "deferred",
  "excluded",
  "needs_research"
] as const;
export type AirportCurationStatus = (typeof curationStatuses)[number];

export const airportScaleValues = [
  "airstrip",
  "community",
  "regional",
  "metro",
  "major",
  "global_gateway"
] as const;
export type CuratedAirportScale = (typeof airportScaleValues)[number];

export const airportUseTypeValues = [
  "private",
  "public",
  "municipal",
  "military",
  "cargo",
  "heliport",
  "seaplane",
  "mixed",
  "unknown"
] as const;
export type CuratedAirportUseType = (typeof airportUseTypeValues)[number];

export const curatedRunwayClassValues = [
  "tiny",
  "small",
  "medium",
  "large",
  "heavy",
  "unknown"
] as const;
export type CuratedRunwayClass = (typeof curatedRunwayClassValues)[number];

export const terrainContextValues = [
  "flat",
  "coastal",
  "mountain",
  "desert",
  "island",
  "remote",
  "urban",
  "mixed",
  "unknown"
] as const;
export type TerrainContext = (typeof terrainContextValues)[number];

export const remotenessValues = [
  "urban",
  "suburban",
  "small_city",
  "rural",
  "remote",
  "isolated"
] as const;
export type AirportRemoteness = (typeof remotenessValues)[number];

export interface RawAirportSourceRecord {
  icao?: string;
  iata?: string;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  elevation?: number;
  elevationFeet?: number;
  lat?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  tz?: string;
  timezone?: string;
}

export type RawAirportSourceInput = Record<string, RawAirportSourceRecord>;

export interface CuratedAirportExportRecord {
  icao?: string;
  airportScale?: CuratedAirportScale;
  airportUseType?: CuratedAirportUseType;
  hasCommercialService?: boolean;
  hasInternationalService?: boolean;
  isCargoRelevant?: boolean;
  isMilitary?: boolean;
  runwayClass?: CuratedRunwayClass;
  terrainContext?: TerrainContext;
  remoteness?: AirportRemoteness;
  marketArea?: string;
  notes?: string;
  researchUrls?: string[];
  curationStatus?: AirportCurationStatus;
  lastReviewedAt?: string;
  excludedReason?: string;
  deferReason?: string;
}

export type CuratedAirportExport = Record<string, CuratedAirportExportRecord>;

interface PreliminaryCuratedAirportRecord {
  airportClass?: string;
  runwayClass?: string;
  marketGroup?: string;
  notes?: string;
  curationStatus?: string;
}

export interface AppAirportRecord extends RawAirportEntry {
  id: AirportId;
  curated: {
    airportScale?: CuratedAirportScale;
    airportUseType?: CuratedAirportUseType;
    hasCommercialService?: boolean;
    hasInternationalService?: boolean;
    isCargoRelevant?: boolean;
    isMilitary?: boolean;
    runwayClass?: CuratedRunwayClass;
    terrainContext?: TerrainContext;
    remoteness?: AirportRemoteness;
    marketArea?: string;
    notes?: string;
    researchUrls: string[];
  };
  curation: {
    status: AirportCurationStatus;
    lastReviewedAt?: string;
    excludedReason?: string;
    deferReason?: string;
  };
  flags: {
    isPlayable: boolean;
    isExcluded: boolean;
    isDeferred: boolean;
    isReviewed: boolean;
    isCommercialPassengerAirport: boolean;
    supportsFounderAircraft: boolean;
    supportsCommuterAircraft: boolean;
    supportsRegionalAircraft: boolean;
    supportsHeavyAircraft: boolean;
  };
}

export interface AirportPipelineOptions {
  includePartial?: boolean;
  includeDeferred?: boolean;
  includeUnreviewed?: boolean;
  includeNeedsResearch?: boolean;
  includeExcluded?: boolean;
}

export interface AirportPipelineDiagnostic {
  code?: string;
  field?: string;
  message: string;
}

export interface AirportPipelineSkippedAirport {
  code: string;
  status: AirportCurationStatus;
  reason: string;
}

export interface AirportPipelineDiagnostics {
  rawAirportCount: number;
  curatedAirportCount: number;
  appReadyAirportCount: number;
  excludedCount: number;
  deferredCount: number;
  missingRawAirportForCuratedRecord: string[];
  missingRequiredCuratedFields: AirportPipelineDiagnostic[];
  invalidRawRecords: AirportPipelineDiagnostic[];
  invalidCuratedRecords: AirportPipelineDiagnostic[];
  duplicateAirportIds: AirportPipelineDiagnostic[];
  airportsSkippedDueToStatus: AirportPipelineSkippedAirport[];
  missingCuratedFile: boolean;
}

export interface AirportPipelineResult {
  rawAirports: RawAirportSource;
  curatedAirports: CuratedAirportExport;
  airports: AppAirportRecord[];
  diagnostics: AirportPipelineDiagnostics;
}

const requiredReviewedFields = [
  "airportScale",
  "airportUseType",
  "hasCommercialService",
  "hasInternationalService",
  "isCargoRelevant",
  "isMilitary",
  "runwayClass",
  "terrainContext",
  "remoteness",
  "marketArea"
] as const;

/** Loads and validates the raw airport source file. */
export async function loadRawAirportSourceFile(filePath: string): Promise<RawAirportSource> {
  const parsed = JSON.parse(await readFile(filePath, "utf8")) as unknown;
  return validateRawAirportSource(parsed).airports;
}

/** Loads and validates a curated airport export file, treating a missing file as an empty optional export. */
export async function loadCuratedAirportExportFile(filePath: string): Promise<{
  airports: CuratedAirportExport;
  missing: boolean;
  diagnostics: AirportPipelineDiagnostic[];
}> {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8")) as unknown;
    const result = validateCuratedAirportExport(parsed);
    return { airports: result.airports, missing: false, diagnostics: result.diagnostics };
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { airports: {}, missing: true, diagnostics: [] };
    }
    throw error;
  }
}

/** Validates and normalizes the raw airport source object keyed by airport code. */
export function validateRawAirportSource(input: unknown): {
  airports: RawAirportSource;
  diagnostics: AirportPipelineDiagnostic[];
} {
  const airports: RawAirportSource = {};
  const diagnostics: AirportPipelineDiagnostic[] = [];

  if (!isPlainObject(input)) {
    return {
      airports,
      diagnostics: [{ message: "Raw airport source must be an object keyed by airport code." }]
    };
  }

  for (const [code, record] of Object.entries(input)) {
    const normalized = normalizeRawAirportRecord(code, record);
    const result = rawAirportEntrySchema.safeParse(normalized);
    if (result.success) {
      airports[code] = result.data;
    } else {
      diagnostics.push({
        code,
        message: `Invalid raw airport record: ${result.error.issues.map((issue) => issue.message).join("; ")}`
      });
    }
  }

  return { airports, diagnostics };
}

/** Validates curated airport gameplay fields keyed by airport code. */
export function validateCuratedAirportExport(input: unknown): {
  airports: CuratedAirportExport;
  diagnostics: AirportPipelineDiagnostic[];
} {
  const airports: CuratedAirportExport = {};
  const diagnostics: AirportPipelineDiagnostic[] = [];

  if (!isPlainObject(input)) {
    return {
      airports,
      diagnostics: [{ message: "Curated airport export must be an object keyed by airport code." }]
    };
  }

  for (const [code, value] of Object.entries(input)) {
    if (!isPlainObject(value)) {
      diagnostics.push({ code, message: "Curated airport record must be an object." });
      continue;
    }
    const record = normalizeCuratedAirportRecord(value as Record<string, unknown>);
    const validated: CuratedAirportExportRecord = {};
    copyString(record, validated as MutableRecord, "icao");
    copyEnum(
      record,
      validated as MutableRecord,
      "airportScale",
      airportScaleValues,
      code,
      diagnostics
    );
    copyEnum(
      record,
      validated as MutableRecord,
      "airportUseType",
      airportUseTypeValues,
      code,
      diagnostics
    );
    copyBoolean(record, validated as MutableRecord, "hasCommercialService", code, diagnostics);
    copyBoolean(record, validated as MutableRecord, "hasInternationalService", code, diagnostics);
    copyBoolean(record, validated as MutableRecord, "isCargoRelevant", code, diagnostics);
    copyBoolean(record, validated as MutableRecord, "isMilitary", code, diagnostics);
    copyEnum(
      record,
      validated as MutableRecord,
      "runwayClass",
      curatedRunwayClassValues,
      code,
      diagnostics
    );
    copyEnum(
      record,
      validated as MutableRecord,
      "terrainContext",
      terrainContextValues,
      code,
      diagnostics
    );
    copyEnum(record, validated as MutableRecord, "remoteness", remotenessValues, code, diagnostics);
    copyString(record, validated as MutableRecord, "marketArea");
    copyString(record, validated as MutableRecord, "notes");
    copyStringArray(record, validated as MutableRecord, "researchUrls", code, diagnostics);
    copyEnum(
      record,
      validated as MutableRecord,
      "curationStatus",
      curationStatuses,
      code,
      diagnostics
    );
    copyString(record, validated as MutableRecord, "lastReviewedAt");
    copyString(record, validated as MutableRecord, "excludedReason");
    copyString(record, validated as MutableRecord, "deferReason");
    airports[code] = validated;
  }

  return { airports, diagnostics };
}

/** Normalizes preliminary development exports into the canonical curated airport shape. */
function normalizeCuratedAirportRecord(record: Record<string, unknown>): Record<string, unknown> {
  if (!isPreliminaryCuratedAirportRecord(record)) {
    return record;
  }

  const preliminary = record as PreliminaryCuratedAirportRecord;
  return {
    ...record,
    airportScale: record.airportScale ?? mapPreliminaryAirportClass(preliminary.airportClass),
    airportUseType: record.airportUseType ?? extractLabeledNoteValue(preliminary.notes, "Use type"),
    runwayClass: mapPreliminaryRunwayClass(preliminary.runwayClass) ?? record.runwayClass,
    terrainContext: record.terrainContext ?? extractLabeledNoteValue(preliminary.notes, "Terrain"),
    remoteness: record.remoteness ?? extractLabeledNoteValue(preliminary.notes, "Remoteness"),
    marketArea: record.marketArea ?? preliminary.marketGroup,
    curationStatus: record.curationStatus ?? "partial"
  };
}

/** Detects the older preliminary app-curated airport export shape. */
function isPreliminaryCuratedAirportRecord(record: Record<string, unknown>): boolean {
  return (
    "airportClass" in record ||
    "startingAirportEligible" in record ||
    "commercialViability" in record ||
    "marketGroup" in record ||
    "manualOverrides" in record
  );
}

/** Maps preliminary airport classes into the current curated scale enum. */
function mapPreliminaryAirportClass(value: string | undefined): CuratedAirportScale | undefined {
  if (value === "commercial") {
    return "metro";
  }
  if (value === "airstrip" || value === "community" || value === "regional" || value === "major") {
    return value;
  }
  return undefined;
}

/** Maps preliminary runway classes into broad runway capability classes. */
function mapPreliminaryRunwayClass(value: string | undefined): CuratedRunwayClass | undefined {
  if (value === "regional") {
    return "medium";
  }
  if (value === "mainline") {
    return "large";
  }
  if (
    value === "heavy" ||
    value === "tiny" ||
    value === "small" ||
    value === "medium" ||
    value === "large"
  ) {
    return value;
  }
  return undefined;
}

/** Extracts a simple label value from generated preliminary curation notes. */
function extractLabeledNoteValue(notes: string | undefined, label: string): string | undefined {
  if (!notes) {
    return undefined;
  }
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = notes.match(new RegExp(`${escapedLabel}:\\s*([^\\.]+)`, "i"));
  return match?.[1]?.trim();
}

/** Builds app-ready airport records from unknown raw and curated inputs. */
export function buildAirportPipeline(
  rawInput: unknown,
  curatedInput: unknown = {},
  options: AirportPipelineOptions = {}
): AirportPipelineResult {
  const rawResult = validateRawAirportSource(rawInput);
  const curatedResult = validateCuratedAirportExport(curatedInput);
  return buildAirportPipelineFromValidated(rawResult.airports, curatedResult.airports, {
    ...options,
    rawDiagnostics: rawResult.diagnostics,
    curatedDiagnostics: curatedResult.diagnostics
  });
}

/** Builds app-ready airport records from already validated raw and curated maps. */
export function buildAirportPipelineFromValidated(
  rawAirports: RawAirportSource,
  curatedAirports: CuratedAirportExport,
  options: AirportPipelineOptions & {
    rawDiagnostics?: AirportPipelineDiagnostic[];
    curatedDiagnostics?: AirportPipelineDiagnostic[];
    missingCuratedFile?: boolean;
  } = {}
): AirportPipelineResult {
  const diagnostics: AirportPipelineDiagnostics = {
    rawAirportCount: Object.keys(rawAirports).length,
    curatedAirportCount: Object.keys(curatedAirports).length,
    appReadyAirportCount: 0,
    excludedCount: 0,
    deferredCount: 0,
    missingRawAirportForCuratedRecord: [],
    missingRequiredCuratedFields: [],
    invalidRawRecords: options.rawDiagnostics ?? [],
    invalidCuratedRecords: options.curatedDiagnostics ?? [],
    duplicateAirportIds: [],
    airportsSkippedDueToStatus: [],
    missingCuratedFile: options.missingCuratedFile ?? false
  };
  const airportIds = new Set<string>();
  const airports: AppAirportRecord[] = [];

  for (const code of Object.keys(curatedAirports)) {
    if (!rawAirports[code]) {
      diagnostics.missingRawAirportForCuratedRecord.push(code);
    }
  }

  for (const [code, raw] of Object.entries(rawAirports)) {
    const curated = curatedAirports[code];
    const status = curated?.curationStatus ?? "unreviewed";
    const airportId = stableAirportId(raw.icao);
    if (airportIds.has(airportId)) {
      diagnostics.duplicateAirportIds.push({ code, message: `Duplicate airport ID ${airportId}.` });
      continue;
    }
    airportIds.add(airportId);

    if (status === "excluded") {
      diagnostics.excludedCount += 1;
    }
    if (status === "deferred") {
      diagnostics.deferredCount += 1;
    }

    const missingFields = missingRequiredFields(curated);
    if (status === "reviewed" && missingFields.length > 0) {
      diagnostics.missingRequiredCuratedFields.push(
        ...missingFields.map((field) => ({
          code,
          field,
          message: `Reviewed airport is missing required curated field ${field}.`
        }))
      );
    }

    const skipReason = skipReasonForStatus(status, options);
    if (skipReason) {
      diagnostics.airportsSkippedDueToStatus.push({ code, status, reason: skipReason });
      continue;
    }

    if (!curated || missingFields.length > 0) {
      diagnostics.airportsSkippedDueToStatus.push({
        code,
        status,
        reason: "Airport is missing required curated fields."
      });
      continue;
    }

    airports.push(toAppAirportRecord(raw, curated, airportId));
  }

  diagnostics.appReadyAirportCount = airports.length;
  return { rawAirports, curatedAirports, airports, diagnostics };
}

/** Loads raw and curated airport files, then builds app-ready airport records. */
export async function buildAirportPipelineFromFiles(
  rawAirportPath: string,
  curatedAirportPath = defaultReviewedAirportExportPath,
  options: AirportPipelineOptions = {}
): Promise<AirportPipelineResult> {
  const rawAirports = await loadRawAirportSourceFile(rawAirportPath);
  const curated = await loadCuratedAirportExportFile(curatedAirportPath);
  return buildAirportPipelineFromValidated(rawAirports, curated.airports, {
    ...options,
    curatedDiagnostics: curated.diagnostics,
    missingCuratedFile: curated.missing
  });
}

/** Returns broad aircraft-tier support flags for a curated runway class. */
export function getRunwayCapabilities(
  runwayClass: CuratedRunwayClass | undefined
): AppAirportRecord["flags"] {
  const supportsFounderAircraft =
    runwayClass === "tiny" ||
    runwayClass === "small" ||
    runwayClass === "medium" ||
    runwayClass === "large" ||
    runwayClass === "heavy";
  const supportsCommuterAircraft =
    runwayClass === "small" ||
    runwayClass === "medium" ||
    runwayClass === "large" ||
    runwayClass === "heavy";
  const supportsRegionalAircraft =
    runwayClass === "medium" || runwayClass === "large" || runwayClass === "heavy";
  const supportsHeavyAircraft = runwayClass === "heavy";
  return {
    isPlayable: false,
    isExcluded: false,
    isDeferred: false,
    isReviewed: false,
    isCommercialPassengerAirport: false,
    supportsFounderAircraft,
    supportsCommuterAircraft,
    supportsRegionalAircraft,
    supportsHeavyAircraft
  };
}

/** Combines a raw airport and curated gameplay data into the app airport record shape. */
function toAppAirportRecord(
  raw: RawAirportEntry,
  curated: CuratedAirportExportRecord,
  id: AirportId
): AppAirportRecord {
  const status = curated.curationStatus ?? "unreviewed";
  const runwayCapabilities = getRunwayCapabilities(curated.runwayClass);
  const isExcluded = status === "excluded";
  const isDeferred = status === "deferred";
  const isReviewed = status === "reviewed";
  return {
    ...raw,
    id,
    curated: {
      airportScale: curated.airportScale,
      airportUseType: curated.airportUseType,
      hasCommercialService: curated.hasCommercialService,
      hasInternationalService: curated.hasInternationalService,
      isCargoRelevant: curated.isCargoRelevant,
      isMilitary: curated.isMilitary,
      runwayClass: curated.runwayClass,
      terrainContext: curated.terrainContext,
      remoteness: curated.remoteness,
      marketArea: curated.marketArea,
      notes: curated.notes,
      researchUrls: curated.researchUrls ?? []
    },
    curation: {
      status,
      lastReviewedAt: curated.lastReviewedAt,
      excludedReason: curated.excludedReason,
      deferReason: curated.deferReason
    },
    flags: {
      ...runwayCapabilities,
      isPlayable: isReviewed && !isExcluded && !isDeferred,
      isExcluded,
      isDeferred,
      isReviewed,
      isCommercialPassengerAirport: curated.hasCommercialService === true
    }
  };
}

/** Normalizes a real raw source record into the shared raw airport schema. */
function normalizeRawAirportRecord(code: string, value: unknown): Partial<RawAirportEntry> {
  if (!isPlainObject(value)) {
    return {};
  }
  const record = value as RawAirportSourceRecord;
  const iata =
    typeof record.iata === "string" && record.iata.trim()
      ? record.iata.trim().toUpperCase()
      : undefined;
  return {
    icao: stringOrFallback(record.icao, code).toUpperCase(),
    iata,
    name: stringOrFallback(record.name, ""),
    city: stringOrFallback(record.city, ""),
    state: optionalString(record.state),
    country: stringOrFallback(record.country, ""),
    elevationFeet: integerOrUndefined(record.elevationFeet ?? record.elevation),
    latitude: numberOrUndefined(record.latitude ?? record.lat),
    longitude: numberOrUndefined(record.longitude ?? record.lon),
    timezone: stringOrFallback(record.timezone ?? record.tz, "")
  };
}

/** Finds curated fields required before a reviewed airport can become app-ready. */
function missingRequiredFields(curated: CuratedAirportExportRecord | undefined): string[] {
  if (!curated) {
    return [...requiredReviewedFields];
  }
  return requiredReviewedFields.filter((field) => {
    const value = curated[field];
    return value === undefined || value === "" || value === "unknown";
  });
}

/** Explains why an airport status is skipped under the current pipeline options. */
function skipReasonForStatus(
  status: AirportCurationStatus,
  options: AirportPipelineOptions
): string | undefined {
  if (status === "reviewed") {
    return undefined;
  }
  if (status === "excluded" && !options.includeExcluded) {
    return "Excluded airports are not app-ready by default.";
  }
  if (status === "deferred" && !options.includeDeferred) {
    return "Deferred airports are not app-ready by default.";
  }
  if (status === "partial" && !options.includePartial) {
    return "Partial airports are not app-ready by default.";
  }
  if (status === "needs_research" && !options.includeNeedsResearch) {
    return "Airports needing research are not app-ready by default.";
  }
  if (status === "unreviewed" && !options.includeUnreviewed) {
    return "Unreviewed airports are not app-ready by default.";
  }
  return undefined;
}

/** Creates a stable branded airport ID from an airport identifier. */
function stableAirportId(icao: string): AirportId {
  const slug = icao
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return airportIdSchema.parse(`airport:${slug || "unknown"}`) as unknown as AirportId;
}

type MutableRecord = Record<string, unknown>;

/** Copies a non-empty string field into a validated mutable record. */
function copyString(record: Record<string, unknown>, target: MutableRecord, field: string): void {
  const value = record[field];
  if (typeof value === "string" && value.trim()) {
    target[field] = value.trim();
  }
}

/** Copies a boolean field or records a type diagnostic. */
function copyBoolean(
  record: Record<string, unknown>,
  target: MutableRecord,
  field: string,
  code: string,
  diagnostics: AirportPipelineDiagnostic[]
): void {
  const value = record[field];
  if (value === undefined) {
    return;
  }
  if (typeof value === "boolean") {
    target[field] = value;
    return;
  }
  diagnostics.push({ code, field, message: `${field} must be a boolean.` });
}

/** Copies an allowed enum field or records a value diagnostic. */
function copyEnum<TAllowed extends readonly string[]>(
  record: Record<string, unknown>,
  target: MutableRecord,
  field: string,
  allowed: TAllowed,
  code: string,
  diagnostics: AirportPipelineDiagnostic[]
): void {
  const value = record[field];
  if (value === undefined) {
    return;
  }
  if (typeof value === "string" && allowed.includes(value)) {
    target[field] = value;
    return;
  }
  diagnostics.push({ code, field, message: `${field} has invalid enum value ${String(value)}.` });
}

/** Copies a string-array field or records a type diagnostic. */
function copyStringArray(
  record: Record<string, unknown>,
  target: MutableRecord,
  field: string,
  code: string,
  diagnostics: AirportPipelineDiagnostic[]
): void {
  const value = record[field];
  if (value === undefined) {
    return;
  }
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    target[field] = value.filter((item) => item.trim()).map((item) => item.trim());
    return;
  }
  diagnostics.push({ code, field, message: `${field} must be an array of strings.` });
}

/** Returns whether a value is a non-array object suitable for record validation. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Returns a trimmed string or a provided fallback. */
function stringOrFallback(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

/** Returns a trimmed optional string. */
function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Returns a finite number or undefined. */
function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** Returns a rounded finite integer or undefined. */
function integerOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : undefined;
}

/** Narrows an unknown error to a Node.js errno-style exception. */
function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
