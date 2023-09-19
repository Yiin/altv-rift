export type NpcInteraction<T = string> = {
  key: string;
  icon: T;
  label: string;
  onSelect(): void;
};
