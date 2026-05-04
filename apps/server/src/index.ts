import { createServer } from "./app";

const server = createServer();
const port = parseInt(process.env.PORT ?? "3000", 10);
if (isNaN(port) || port <= 0 || port > 65535) {
  console.error(`Invalid PORT value: ${process.env.PORT}`);
}
const host = process.env.HOST ?? "127.0.0.1";

try {
  await server.listen({ host, port });
} catch (error) {
  server.log.error(error);
}
