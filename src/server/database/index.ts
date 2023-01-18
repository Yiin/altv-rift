import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";

export const prisma = new PrismaClient();

prisma.$connect().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

container.bind(PrismaClient).toConstantValue(prisma);
