import * as fs from "fs";
import * as path from "path";

function createMigration() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Please provide a migration name");
    process.exit(1);
  }

  const migrationName = args[0];
  const date = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
  const dirName = `${date}_${migrationName}`;
  const migrationDir = path.join(__dirname, dirName);

  // Create the migration directory
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir);
  }

  // Create the index.ts file with a template
  const indexPath = path.join(migrationDir, "index.ts");
  const indexContent = `import { PrismaClient } from "@prisma/client";
import { Migration } from "../index";

export const migration: Migration = {
  name: "${date}_${migrationName}",
  execute: async (prisma: PrismaClient) => {
    // Your migration code here
    
  },
};

// CommonJS compatibility for require()
// @ts-ignore
if (typeof module !== 'undefined' && module.exports) {
  // @ts-ignore
  module.exports = { migration };
}`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created migration: ${dirName}`);
}

createMigration();
