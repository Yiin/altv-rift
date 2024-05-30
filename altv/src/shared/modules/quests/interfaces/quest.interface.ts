export interface Quest {
  Key: string;
  Facts: Record<string, string>;
  Name: string;
  Summary: string;
  Tasks: {
    fact: string;
    summary: string;
  }[];
  Dialogs: Partial<Record<string, string>>;
}
