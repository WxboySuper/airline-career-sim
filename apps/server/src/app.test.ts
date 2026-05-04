import { afterAll, describe, expect, it } from "vitest";

import { createServer } from "./app";

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
});
