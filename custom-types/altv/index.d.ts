declare module "alt-shared" {
  export interface ICustomGlobalMeta {
    numberExample: number;
    stringExample: string;
  }

  export interface ICustomPlayerStreamSyncedMeta {
    numberExample: number;
    stringExample: string;
  }
}

declare module "alt-server" {
  export interface IServerEvent {
    "discord:AuthDone": (
      player: import("alt-server").Player,
      discordInfo: any
    ) => any;
  }

  export interface ICustomServerEvent {
    "user:Loaded": (player: import("alt-server").Player) => any;
  }

  export interface Player {
    user?: LoadedUser;
    character?: import("@prisma/client").Character;

    loadUser(user: LoadedUser): Promise<LoadedUser | null>;
    loadUser(discordId: string): Promise<LoadedUser | null>;
    createCharacter(
      characterData: import("@prisma/client").Prisma.CharacterCreateInput
    ): Promise<import("@prisma/client").Character>;
    saveCharacter(): Promise<void>;
    deleteCharacter(characterId: string): Promise<void>;
    loadCharacter(
      characterId: string
    ): Promise<import("@prisma/client").Character | null>;
    getCharacters(): Promise<import("@prisma/client").Character[]>;
    updateCharacterAppearance(
      appearance: import("@prisma/client").Appearance
    ): void;
  }
}

declare module "alt-client" {
  export interface ICustomClientEvent {}
}
