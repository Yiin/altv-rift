export class StringBuffer {
  /**
   * Create a String Buffer from a string.
   * Splits huge strings into a larger array.
   */
  static toBuffer(data: string, size: number = 512): string[] {
    const stringMatch = new RegExp(`.{1,${size}}`, "g");
    return data.match(stringMatch)!;
  }

  /**
   * Turns a buffer into a string.
   */
  static fromBuffer(data: string[]): string {
    return data.join("");
  }
}
