import { getCurrentNode } from "../internals/current-node";

export function useEffect(fn: () => () => void) {
  getCurrentNode().cleanup.push(fn());
}
