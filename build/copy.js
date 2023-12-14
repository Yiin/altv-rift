import fs from "fs";
import path from "path";
import glob from "glob";

export const copyFile = (source, dest) => {
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  fs.copyFileSync(source, dest);
};

export const copy = async (globPattern, dest) => {
  try {
    const files = await glob(globPattern);

    files.forEach((file) => {
      const relativePath = path.relative("src", file);
      const destPath = path.join(dest, relativePath);
      copyFile(file, destPath);
    });
  } catch (err) {
    console.error("Failed to read", globPattern, "err:", err);
    process.exit(-1);
  }
};
