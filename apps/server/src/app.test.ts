import { afterAll, describe, expect, it } from "vitest";

import { createServer } from "./app";
import { InMemorySaveRepository } from "./saveRepository";

const server = createServer();

afterAll(async () => {
  await server.close();
});

describe("server", () => {
  it("responds to the health endpoint", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      ok: true,
      service: "Airline Career Simulator"
    });
  });

  it("creates a save through game-core bootstrap", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        userId: "user:server-create",
        airlineName: "Server Create Air",
        founderName: "Avery Cole",
        airlineCode: "SC",
        starterAirportId: "airport:kalo",
        createdAt: "2026-05-11T08:00:00.000-05:00",
        currentGameTime: "2026-05-11T08:00:00.000-05:00"
      }
    });

    expect(response.statusCode).toBe(200);
    const save = response.json();
    expect(save.id).toBe("save:server-create-air-kalo");
    expect(save.airline.name).toBe("Server Create Air");
    expect(save.aircraft).toHaveLength(1);
    expect(save.routes).toEqual([]);
    expect(save.objectiveState.trackedObjectiveId).toBe("objective:choose-first-route");
    expect(save.inboxMessages.length).toBeGreaterThan(0);
  });

  it("rejects invalid create requests", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        userId: "not-a-user-id",
        airlineName: "Broken Air"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: "validation_error"
    });
  });

  it("gets, lists, updates, and deletes development saves", async () => {
    const createResponse = await server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        userId: "user:server-roundtrip",
        airlineName: "Server Roundtrip Air",
        founderName: "Parker Lane",
        airlineCode: "SR",
        starterAirportId: "airport:kalo",
        createdAt: "2026-05-11T08:00:00.000-05:00",
        currentGameTime: "2026-05-11T08:00:00.000-05:00"
      }
    });
    const save = createResponse.json();

    const getResponse = await server.inject({
      method: "GET",
      url: `/dev/saves/${save.id}`
    });
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.json().id).toBe(save.id);

    const listResponse = await server.inject({
      method: "GET",
      url: "/dev/saves"
    });
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json().map((candidate: { id: string }) => candidate.id)).toContain(save.id);

    const updatedSave = {
      ...save,
      airline: {
        ...save.airline,
        cash: save.airline.cash + 1000
      },
      financeState: {
        ...save.financeState,
        currentCash: save.financeState.currentCash + 1000
      }
    };
    const updateResponse = await server.inject({
      method: "PUT",
      url: `/dev/saves/${save.id}`,
      payload: updatedSave
    });
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json().airline.cash).toBe(updatedSave.airline.cash);

    const deleteResponse = await server.inject({
      method: "DELETE",
      url: `/dev/saves/${save.id}`
    });
    expect(deleteResponse.statusCode).toBe(204);

    const missingResponse = await server.inject({
      method: "GET",
      url: `/dev/saves/${save.id}`
    });
    expect(missingResponse.statusCode).toBe(404);
  });

  it("rejects invalid save replacement payloads", async () => {
    const response = await server.inject({
      method: "PUT",
      url: "/dev/saves/save:missing",
      payload: {
        id: "save:missing"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: "validation_error"
    });
  });

  it("stores cloned saves in the in-memory repository", () => {
    const repository = new InMemorySaveRepository();
    const createResponse = server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        userId: "user:repository-source",
        airlineName: "Repository Source Air",
        founderName: "Dev Tester",
        airlineCode: "RS",
        starterAirportId: "airport:kalo",
        createdAt: "2026-05-11T08:00:00.000-05:00",
        currentGameTime: "2026-05-11T08:00:00.000-05:00"
      }
    });

    return createResponse.then((response) => {
      const save = response.json();
      const stored = repository.create(save);
      stored.airline.name = "Mutated Outside";

      expect(repository.get(save.id)?.airline.name).toBe("Repository Source Air");
      expect(repository.list()).toHaveLength(1);
      expect(repository.delete(save.id)).toBe(true);
      expect(repository.get(save.id)).toBeUndefined();
    });
  });
});
