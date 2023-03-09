import alt from "alt-client";

export const serialize = (value: any): any => {
  if (value instanceof alt.Vehicle) {
    return {
      $$type: "vehicle",
      id: value.id,
    };
  }
  if (value instanceof alt.Player) {
    return {
      $$type: "player",
      id: value.id,
    };
  }
  if (value instanceof alt.Entity) {
    return {
      $$type: "entity",
      id: value.id,
    };
  }
  if (value instanceof alt.Vector3) {
    return {
      $$type: "vector3",
      x: value.x,
      y: value.y,
      z: value.z,
    };
  }
  if (value instanceof alt.RGBA) {
    return {
      $$type: "rgba",
      r: value.r,
      g: value.g,
      b: value.b,
      a: value.a,
    };
  }
  if (Array.isArray(value)) {
    return value.map(serialize);
  }
  if (typeof value === "object") {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = serialize(value[key]);
      return acc;
    }, {} as any);
  }
  return value;
};

export const deserialize = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(deserialize);
  }
  if (typeof value === "object") {
    switch (value.$$type) {
      case "vehicle":
        return alt.Vehicle.getByID(value.id);
      case "player":
        return alt.Player.getByID(value.id);
      case "entity":
        return alt.Entity.getByID(value.id);
      case "vector3":
        return new alt.Vector3(value.x, value.y, value.z);
      case "rgba":
        return new alt.RGBA(value.r, value.g, value.b, value.a);
    }
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = deserialize(value[key]);
      return acc;
    }, {} as any);
  }
  return value;
};
