import { serialize as s, deserialize as d } from "alpha-serializer";

export function serialize(value: any) {
  return s(value);
}

export function deserialize(value: any) {
  try {
    return d(value);
  } catch {
    return value;
  }
}
