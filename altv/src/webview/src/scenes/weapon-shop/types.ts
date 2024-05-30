interface Properties {
  damage: number;
  firerate: number;
  clip: number;
  accuracy: number;
}

export interface RifleType {
  name: string;
  ammo: string;
  image: string;
  properties: Properties;
  isInStock: boolean;
  price: number;
  includedMods: string[];
}
