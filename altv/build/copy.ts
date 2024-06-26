import fs from "fs";
import path from "path";
import glob from "glob";

export const copyFile = (source: string, dest: string) => {
  const destPath = source.replace("src/", dest);

  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(source, destPath);
  }
};

export const copy = async (globPattern: string, dest: string) => {
  try {
    const files = await glob(globPattern);

    files.forEach((file) => {
      copyFile(file, dest);
    });
  } catch (err) {
    console.error(err);
    // process.exit(-1);
  }
};
