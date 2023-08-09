export type NpcInteraction<T = string> = {
  icon: T;
  label: string;
  onSelect(): void;
};
