export interface WeaponModuleType {
  name: string;
  image: string;
  shortDesc: string;
  isActive: boolean;
}

export interface AvailableWeaponModuleType {
  name: string;
  image: string;
  desc: string;
  isActive: boolean;
  stage: number;
  price: number;
  extras: {
    name: string;
    image: string;
    desc: string;
    x: string;
  }[];
}