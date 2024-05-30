export type PedInteraction<T = string> = {
  key: string;
  icon: T;
  label: string;
  onSelect(): void;
};
