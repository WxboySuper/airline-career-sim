import Fastify from "fastify";
import { z } from "zod";

import {
  createNewAirlineSave,
  type CreateNewAirlineSaveOptions
} from "@airline-career-sim/game-core";
import { productName, saveGameSchema, type HealthResponse } from "@airline-career-sim/shared";

import { createInMemorySaveRepository, type SaveRepository } from "./saveRepository";

const createSaveRequestSchema = z.object({
  userId: z.string().min(1),
  airlineName: z.string().min(1),
  founderName: z.string().min(1),
  airlineCode: z.string().min(2).max(6),
  starterAirportId: z.string().optional(),
  starterAircraftTypeId: z.string().optional(),
  simulationPaceId: z.string().optional(),
  difficulty: z.enum(["easy", "standard", "challenging", "hard"]).optional(),
  createdAt: z.string().optional(),
  currentGameTime: z.string().optional(),
  paused: z.boolean().optional(),
  airlineShortName: z.string().optional(),
  airlineCallsign: z.string().optional(),
  primaryMarketArea: z.string().optional(),
  brandingSeed: z.string().optional(),
  founderBackgroundArchetype: z.string().optional(),
  founderReputationModifier: z.number().optional(),
  founderFinanceModifier: z.number().optional(),
  aircraftRegistration: z.string().optional(),
  saveId: z.string().optional()
});

/**
 * Creates and configures the Fastify server instance.
 *
 * @param repository - Development save repository implementation.
 * @returns The configured Fastify server instance.
 */
export function createServer(repository: SaveRepository = createInMemorySaveRepository()) {
  const server = Fastify({
    logger: true
  });

  server.get<{ Reply: HealthResponse }>("/health", () => ({
    ok: true,
    service: productName
  }));

  server.post("/dev/saves", async (request, reply) => {
    const parsed = createSaveRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        errors: parsed.error.flatten()
      });
    }

    const saveOptions = parsed.data as CreateNewAirlineSaveOptions;
    const save = saveGameSchema.parse(createNewAirlineSave(saveOptions));
    const stored = await repository.create(save);
    return reply.code(201).send({ ok: true, save: stored });
  });

  server.get("/dev/saves", async () => ({
    ok: true,
    saves: await repository.list()
  }));

  server.get("/dev/saves/:saveId", async (request, reply) => {
    const params = z.object({ saveId: z.string().min(1) }).safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ ok: false, error: "Invalid save ID." });
    }

    const save = await repository.getById(params.data.saveId as never);
    if (!save) {
      return reply.code(404).send({ ok: false, error: "Save not found." });
    }

    return { ok: true, save };
  });

  server.put("/dev/saves/:saveId", async (request, reply) => {
    const params = z.object({ saveId: z.string().min(1) }).safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ ok: false, error: "Invalid save ID." });
    }

    const parsedSave = saveGameSchema.safeParse(request.body);
    if (!parsedSave.success) {
      return reply.code(400).send({
        ok: false,
        errors: parsedSave.error.flatten()
      });
    }

    if (parsedSave.data.id !== params.data.saveId) {
      return reply.code(400).send({
        ok: false,
        error: "Save ID in the path must match the save payload."
      });
    }

    const stored = await repository.replace(parsedSave.data);
    return { ok: true, save: stored };
  });

  server.delete("/dev/saves/:saveId", async (request, reply) => {
    const params = z.object({ saveId: z.string().min(1) }).safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ ok: false, error: "Invalid save ID." });
    }

    const removed = await repository.delete(params.data.saveId as never);
    if (!removed) {
      return reply.code(404).send({ ok: false, error: "Save not found." });
    }

    return { ok: true };
  });

  return server;
}
