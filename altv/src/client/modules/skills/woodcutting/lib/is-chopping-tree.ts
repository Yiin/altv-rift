let chopping = false;

export function isChoppingTree() {
  return chopping;
}

export function setIsChoppingTree(value: boolean) {
  chopping = value;
}
