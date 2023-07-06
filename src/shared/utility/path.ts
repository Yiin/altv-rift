function normalizePath(path: string): string {
  const isAbsolute = path.startsWith("/");
  const parts = path.split("/").filter(Boolean); // filter out empty parts

  const resolvedParts: string[] = [];
  for (const part of parts) {
    if (part === ".") {
      // Ignore current directory path
      continue;
    } else if (part === "..") {
      // Go up one directory by removing last element from resolvedParts
      resolvedParts.pop();
    } else {
      resolvedParts.push(part);
    }
  }

  return (isAbsolute ? "/" : "") + resolvedParts.join("/");
}

export function join(...paths: string[]): string {
  return normalizePath(paths.join("/"));
}
