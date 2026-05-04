import Fastify from "fastify";

import { productName } from "@airline-career-sim/shared";

export function createServer() {
  const server = Fastify({
    logger: true
  });

  server.get("/health", async () => ({
    ok: true,
    service: productName
  }));

  return server;
}
