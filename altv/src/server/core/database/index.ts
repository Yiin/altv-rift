import { PrismaClient } from "@prisma/client";
import _ from "lodash";
import { container } from "@shared/dependency-injection";

export const prisma = new PrismaClient();

prisma.$connect();

container.bind(PrismaClient).toConstantValue(prisma);
