interface Requirement {
  name: string;
  image: string;
}

interface Tag {
  text: string;
  bgCol: string;
}

interface Properties {
  damage: number;
  firerate: number;
  clip: number;
  accuracy: number;
}

interface CraftingInfo {
  chance: number;
  time: string;
}

export interface RifleType {
  name: string;
  tag: Tag;
  ammo: string;
  image: string;
  isActive: boolean;
  properties: Properties;
  requirements: Requirement[];
  craftingInfo: CraftingInfo;
}
