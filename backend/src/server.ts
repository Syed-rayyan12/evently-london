import { app } from "./app.js";
import { env } from "./env.js";
import { prisma } from "./lib/prisma.js";

const server = app.listen(env.PORT, () => {
  if (env.NODE_ENV !== "production") {
    console.log(`Backend API listening on http://localhost:${env.PORT}`);
  }
});

function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
