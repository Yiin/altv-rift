import alt from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

export const prisma = new PrismaClient();

let connected = false;

prisma.$connect().then(async () => {
  connected = true;
});

prisma.$on("beforeExit", async () => {
  if (!connected) {
    console.error("Couldn't connect to the database. `$ npm run mongo`?");
    alt.stopServer();
  }
});

container.bind(PrismaClient).toConstantValue(prisma);
