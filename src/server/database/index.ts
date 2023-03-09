import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";

export const prisma = new PrismaClient();

prisma
  .$connect()
  .then(async () => {
    prisma.character.update({
      where: {
        id: "63e9df6fd0b3a3f6f474d37a",
      },
      data: {
        inventory: {
          set: {
            items: [
              {
                slot: 11,
                data: {
                  key: "appistol",
                  type: "WEAPON",
                  WEAPON: {
                    durability: 100,
                  },
                },
              },
            ],
            size: 10,
          },
        },
      },
    });
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

container.bind(PrismaClient).toConstantValue(prisma);
