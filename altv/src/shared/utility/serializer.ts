import { serialize as s, deserialize as d } from "alpha-serializer";

export function serialize(value: any): any {
  return s(value);
}

export function deserialize(value: any): any {
  try {
    return d(value);
  } catch {
    return value;
  }
}
