import { afterEach, describe, expect, it, vi } from "vitest";

import { createNewAirlineSave } from "@airline-career-sim/game-core";

import { createServer } from "./app";
import { createInMemorySaveRepository } from "./saveRepository";

describe("server", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("responds to the health endpoint", async () => {
    const server = createServer(createInMemorySaveRepository());
    const response = await server.inject({
      method: "GET",
      url: "/health"
    });

    await server.close();
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      ok: true,
      service: "Airline Career Simulator"
    });
  });

  it("creates, lists, fetches, updates, and deletes saves through the dev API", async () => {
    const repository = createInMemorySaveRepository();
    const createSpy = vi.spyOn(repository, "create");
    const server = createServer(repository);

    const createResponse = await server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        userId: "user:server-test",
        airlineName: "Server Test Air",
        founderName: "Avery Stone",
        airlineCode: "STA",
        starterAirportId: "airport:kalo",
        starterAircraftTypeId: "aircraft-type:aster-a8-courier"
      }
    });
    expect(createResponse.statusCode).toBe(201);
    expect(createSpy).toHaveBeenCalledTimes(1);

    const created = createResponse.json() as { ok: boolean; save: { id: string } };
    expect(created.ok).toBe(true);

    const listResponse = await server.inject({
      method: "GET",
      url: "/dev/saves"
    });
    expect(listResponse.statusCode).toBe(200);
    expect((listResponse.json() as { saves: unknown[] }).saves).toHaveLength(1);

    const getResponse = await server.inject({
      method: "GET",
      url: `/dev/saves/${created.save.id}`
    });
    expect(getResponse.statusCode).toBe(200);

    const save = createNewAirlineSave({
      userId: "user:server-test",
      airlineName: "Server Test Air",
      founderName: "Avery Stone",
      airlineCode: "STA",
      starterAirportId: "airport:kalo",
      starterAircraftTypeId: "aircraft-type:aster-a8-courier"
    });
    const updateResponse = await server.inject({
      method: "PUT",
      url: `/dev/saves/${save.id}`,
      payload: save
    });
    expect(updateResponse.statusCode).toBe(200);

    const deleteResponse = await server.inject({
      method: "DELETE",
      url: `/dev/saves/${save.id}`
    });
    expect(deleteResponse.statusCode).toBe(200);

    await server.close();
  });

  it("rejects invalid save create payloads", async () => {
    const server = createServer(createInMemorySaveRepository());
    const response = await server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        airlineName: "Missing Fields"
      }
    });

    await server.close();
    expect(response.statusCode).toBe(400);
  });

  it("returns 400 when bootstrap receives unknown starter catalog IDs", async () => {
    const server = createServer(createInMemorySaveRepository());
    const response = await server.inject({
      method: "POST",
      url: "/dev/saves",
      payload: {
        userId: "user:server-test",
        airlineName: "Invalid Starter Air",
        founderName: "Avery Stone",
        airlineCode: "INV",
        starterAirportId: "airport:does-not-exist"
      }
    });

    await server.close();
    expect(response.statusCode).toBe(400);
    expect((response.json() as { ok: boolean }).ok).toBe(false);
  });

  it("returns 404 when replacing a save that was never stored", async () => {
    const save = createNewAirlineSave({
      userId: "user:server-test",
      airlineName: "Never Stored Air",
      founderName: "Avery Stone",
      airlineCode: "NSA",
      starterAirportId: "airport:kalo",
      starterAircraftTypeId: "aircraft-type:aster-a8-courier"
    });
    const server = createServer(createInMemorySaveRepository());
    const response = await server.inject({
      method: "PUT",
      url: `/dev/saves/${save.id}`,
      payload: save
    });

    await server.close();
    expect(response.statusCode).toBe(404);
  });
});
