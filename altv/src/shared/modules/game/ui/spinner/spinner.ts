import { SPINNER_TYPE } from "@shared/modules/game/ui/spinner/spinner-type";

export interface Spinner {
  /**
   * How long in milliseconds this spinner should last.
   * Use -1 to set forever.
   */
  duration: number;

  /**
   * The text this spinner should have beside it.
   */
  text: string;

  /**
   * The type of spinner to use.
   */
  type?: number | SPINNER_TYPE;
}
