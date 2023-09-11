type PrismaModels = {
  user: import("@prisma/client").User;
  character: import("@prisma/client").Character;
};
type PrismaModel = PrismaModels[keyof PrismaModels];
