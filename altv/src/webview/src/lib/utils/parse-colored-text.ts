import { h } from "vue";

// Define regex patterns outside to avoid recreation
const PATTERNS = {
  // Color code: {ff0000}text
  color: /\{([0-9a-f]{6})\}/gi,
  // Bold: {b}text{/b}
  boldStart: /\{b\}/gi,
  boldEnd: /\{\/b\}/gi,
  // Semibold: {sb}text{/sb}
  semiboldStart: /\{sb\}/gi,
  semiboldEnd: /\{\/sb\}/gi,
  // Italic: {i}text{/i}
  italicStart: /\{i\}/gi,
  italicEnd: /\{\/i\}/gi,
  // Underline: {u}text{/u}
  underlineStart: /\{u\}/gi,
  underlineEnd: /\{\/u\}/gi,
};

// Reset all regex patterns to avoid lastIndex issues
function resetRegexPatterns() {
  Object.values(PATTERNS).forEach((pattern) => {
    pattern.lastIndex = 0;
  });
}

// Define types for tag matches
interface TagMatch {
  type: string;
  match: string;
  index: number;
  color?: string;
}

// Define style state interface
interface StyleState {
  color: string | null;
  // Track stacks of styles to handle nested formatting correctly
  weightStack: Array<{ type: "bold" | "semibold"; value: string }>;
  italic: boolean;
  underline: boolean;
}

// Define format tag mapping outside
const FORMAT_TAGS = [
  { regex: PATTERNS.boldStart, type: "boldStart" },
  { regex: PATTERNS.boldEnd, type: "boldEnd" },
  { regex: PATTERNS.semiboldStart, type: "semiboldStart" },
  { regex: PATTERNS.semiboldEnd, type: "semiboldEnd" },
  { regex: PATTERNS.italicStart, type: "italicStart" },
  { regex: PATTERNS.italicEnd, type: "italicEnd" },
  { regex: PATTERNS.underlineStart, type: "underlineStart" },
  { regex: PATTERNS.underlineEnd, type: "underlineEnd" },
];

// Sort function used for tag sorting
function sortByIndex(a: TagMatch, b: TagMatch): number {
  return a.index - b.index;
}

// Helper to build style props based on style state
function buildStyleProps(styles: StyleState): Record<string, any> {
  const props: Record<string, any> = { style: {} };

  if (styles.color) {
    props.style.color = `#${styles.color}`;
  }

  // Apply the font weight from the top of the stack (most recently applied)
  if (styles.weightStack.length > 0) {
    const topWeight = styles.weightStack[styles.weightStack.length - 1];
    props.style.fontWeight = topWeight.value;
  }

  if (styles.italic) {
    props.style.fontStyle = "italic";
  }
  if (styles.underline) {
    props.style.textDecoration = "underline";
  }

  return props;
}

// Helper to find all tags in a text
function findAllFormattingTags(text: string): TagMatch[] {
  const allMatches: TagMatch[] = [];
  let tagMatch;

  // Reset all regex patterns before use
  resetRegexPatterns();

  // Find color codes
  while ((tagMatch = PATTERNS.color.exec(text)) !== null) {
    allMatches.push({
      type: "color",
      match: tagMatch[0],
      color: tagMatch[1],
      index: tagMatch.index,
    });
  }

  // Find all formatting tags
  for (let i = 0; i < FORMAT_TAGS.length; i++) {
    const tag = FORMAT_TAGS[i];
    let match;
    tag.regex.lastIndex = 0; // Explicitly reset for each pattern
    while ((match = tag.regex.exec(text)) !== null) {
      allMatches.push({ type: tag.type, match: match[0], index: match.index });
    }
  }

  // Sort all matches by their position in the text
  return allMatches.sort(sortByIndex);
}

export function parseColoredText(text: string) {
  if (!text.includes("{")) return text;

  // Store the current style states
  const styles: StyleState = {
    color: null,
    weightStack: [],
    italic: false,
    underline: false,
  };

  // Find all tags in the text
  const tags = findAllFormattingTags(text);

  if (tags.length === 0) {
    return text; // No formatting needed
  }

  // Process the text with formatting
  const result = [];
  let lastPos = 0;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    // Add text before the tag
    if (tag.index > lastPos) {
      const textBefore = text.substring(lastPos, tag.index);
      if (textBefore) {
        result.push(h("span", buildStyleProps(styles), textBefore));
      }
    }

    // Update styles based on the tag
    if (tag.type === "color") {
      styles.color = tag.color || null;
    } else if (tag.type === "boldStart") {
      styles.weightStack.push({ type: "bold", value: "700" });
    } else if (tag.type === "boldEnd") {
      // Remove the most recent bold from the stack
      styles.weightStack = styles.weightStack.filter((item, index, arr) => {
        // Keep this item if it's not bold OR if there's a later bold in the stack
        return item.type !== "bold" || arr.slice(index + 1).some((i) => i.type === "bold");
      });
    } else if (tag.type === "semiboldStart") {
      styles.weightStack.push({ type: "semibold", value: "600" });
    } else if (tag.type === "semiboldEnd") {
      // Remove the most recent semibold from the stack
      styles.weightStack = styles.weightStack.filter((item, index, arr) => {
        // Keep this item if it's not semibold OR if there's a later semibold in the stack
        return item.type !== "semibold" || arr.slice(index + 1).some((i) => i.type === "semibold");
      });
    } else if (tag.type === "italicStart") {
      styles.italic = true;
    } else if (tag.type === "italicEnd") {
      styles.italic = false;
    } else if (tag.type === "underlineStart") {
      styles.underline = true;
    } else if (tag.type === "underlineEnd") {
      styles.underline = false;
    }

    lastPos = tag.index + tag.match.length;
  }

  // Add text after the last tag
  if (lastPos < text.length) {
    const textAfter = text.substring(lastPos);
    if (textAfter) {
      result.push(h("span", buildStyleProps(styles), textAfter));
    }
  }

  return result.length > 0 ? h("div", {}, result) : text;
}
