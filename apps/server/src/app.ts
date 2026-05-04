import Fastify from "fastify";

import { productName, type HealthResponse } from "@airline-career-sim/shared";

/**
 * Creates and configures the Fastify server instance.
 *
 * @returns The configured Fastify server instance.
 */
export function createServer() {
  const server = Fastify({
    logger: true
  });

  server.get<{ Reply: HealthResponse }>("/health", () => ({
    ok: true,
    service: productName
  }));

  return server;
}
