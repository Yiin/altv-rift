import { ItemFlags, registerItem } from "@shared/modules/items";
import { Item } from "../types";
import { makeKeys } from "../../../utility/make-keys";

export const Note = makeKeys<NoteItemKey>()({
  INTRODUCTION_MAP: "introduction_map",
});

export type NoteItemKey = Brand<string, "NoteItemKey">;

export type NoteItem = {
  key: NoteItemKey;
};

export type NoteItemInfo = {
  key: NoteItemKey;
  name: string;
  description: string;
  flags: ItemFlags;
};

export const notes: NoteItemInfo[] = [
  {
    key: Note.INTRODUCTION_MAP,
    name: "Map from Cal",
    description: "A map containing some sketches of the area.",
    flags: ItemFlags.IsPreviewable | ItemFlags.DestroyOnDrop,
  },
];

/**
 * Register all notes.
 */
for (const info of notes) {
  registerItem(info);
}

/***
 * Type guards for notes
 */
export function isItemKeyNote(key: string): key is NoteItemKey {
  return notes.some((rod) => rod.key === key);
}

export function isItemNote(item: Item): item is NoteItem {
  return isItemKeyNote(item.key);
}
