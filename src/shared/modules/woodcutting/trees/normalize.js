import fs from "fs";
import path from "path";

let totalTrees = 0;

// Read all files in the current directory
fs.readdir(".", (err, files) => {
  if (err) {
    console.error("An error occurred:", err);
    return;
  }

  // Filter for .json files
  const jsonFiles = files.filter((file) => path.extname(file) === ".json");

  // Process each JSON file
  jsonFiles.forEach((file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(`An error occurred reading ${file}:`, err);
        return;
      }

      // Parse the JSON content
      let content = JSON.parse(data);

      // Update the content
      content = content.map((item) => {
        if ("Position" in item) {
          return {
            x: item.Position.X,
            y: item.Position.Y,
            z: item.Position.Z,
          };
        }
        return item;
      });

      totalTrees += content.length;

      // Convert back to JSON string
      const updatedData = JSON.stringify(content);

      // Write back to the file
      fs.writeFile(file, updatedData, "utf8", (err) => {
        if (err) {
          console.error(`An error occurred writing ${file}:`, err);
        } else {
          console.log(`${file} updated successfully.`);
        }
      });
    });
  });
});
