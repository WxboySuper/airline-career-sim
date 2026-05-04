import Fastify from "fastify";

import { productName, type HealthResponse } from "@airline-career-sim/shared";

export function createServer() {
  const server = Fastify({
    logger: true
  });

  server.get<{ Reply: HealthResponse }>("/health", async () => ({
    ok: true,
    service: productName
  }));

  return server;
}
