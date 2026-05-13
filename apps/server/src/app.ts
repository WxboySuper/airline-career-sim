import Fastify from "fastify";

import {
  createNewAirlineSave,
  type CreateNewAirlineSaveOptions
} from "@airline-career-sim/game-core";
import {
  productName,
  saveGameSchema,
  saveIdSchema,
  type HealthResponse,
  type SaveGame
} from "@airline-career-sim/shared";

import { InMemorySaveRepository, type SaveRepository } from "./saveRepository";

type ErrorResponse = {
  error: string;
  message: string;
};

type SaveRouteParams = {
  saveId: string;
};

type CreateServerOptions = {
  saveRepository?: SaveRepository;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseSaveIdParam = (value: string) => {
  const parsed = saveIdSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
};

const validationError = (message: string): ErrorResponse => ({
  error: "validation_error",
  message
});

/**
 * Creates and configures the Fastify server instance.
 *
 * @param options - Optional server dependencies for tests and development.
 * @returns The configured Fastify server instance.
 */
export function createServer(options: CreateServerOptions = {}) {
  const saveRepository = options.saveRepository ?? new InMemorySaveRepository();
  const server = Fastify({
    logger: true
  });

  server.get<{ Reply: HealthResponse }>("/health", () => ({
    ok: true,
    service: productName
  }));

  // TODO: protect these development routes with Firebase Auth before production use.
  // TODO: replace the repository with Postgres-backed persistence before real saves ship.
  server.post<{ Body: unknown; Reply: SaveGame | ErrorResponse }>("/dev/saves", (request, reply) => {
    if (!isRecord(request.body)) {
      reply.code(400);
      return validationError("Request body must be an object.");
    }

    try {
      const save = createNewAirlineSave(request.body as CreateNewAirlineSaveOptions);
      return saveRepository.create(save);
    } catch (error) {
      reply.code(400);
      return validationError(error instanceof Error ? error.message : "Save could not be created.");
    }
  });

  server.get<{ Reply: SaveGame[] }>("/dev/saves", () => saveRepository.list());

  server.get<{ Params: SaveRouteParams; Reply: SaveGame | ErrorResponse }>(
    "/dev/saves/:saveId",
    (request, reply) => {
      const saveId = parseSaveIdParam(request.params.saveId);
      if (!saveId) {
        reply.code(400);
        return validationError("Save ID is invalid.");
      }

      const save = saveRepository.get(saveId);
      if (!save) {
        reply.code(404);
        return { error: "not_found", message: "Save not found." };
      }

      return save;
    }
  );

  server.put<{ Params: SaveRouteParams; Body: unknown; Reply: SaveGame | ErrorResponse }>(
    "/dev/saves/:saveId",
    (request, reply) => {
      const saveId = parseSaveIdParam(request.params.saveId);
      if (!saveId) {
        reply.code(400);
        return validationError("Save ID is invalid.");
      }

      const parsedSave = saveGameSchema.safeParse(request.body);
      if (!parsedSave.success) {
        reply.code(400);
        return validationError(parsedSave.error.issues.map((issue) => issue.message).join("; "));
      }
      if (parsedSave.data.id !== saveId) {
        reply.code(400);
        return validationError("Save ID in the URL must match the save payload.");
      }

      return saveRepository.replace(parsedSave.data);
    }
  );

  server.delete<{ Params: SaveRouteParams; Reply: ErrorResponse | undefined }>(
    "/dev/saves/:saveId",
    (request, reply) => {
      const saveId = parseSaveIdParam(request.params.saveId);
      if (!saveId) {
        reply.code(400);
        return validationError("Save ID is invalid.");
      }

      if (!saveRepository.delete(saveId)) {
        reply.code(404);
        return { error: "not_found", message: "Save not found." };
      }

      reply.code(204).send(undefined);
      return undefined;
    }
  );

  return server;
}
