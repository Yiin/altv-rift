type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type PrismaModels = {
  user: import("@prisma/client").User;
  character: import("@prisma/client").Character;
};
type PrismaModel = PrismaModels[keyof PrismaModels];

type LoadedUser = import("@prisma/client").User & {
  characters: import("@prisma/client").Character[];
};
