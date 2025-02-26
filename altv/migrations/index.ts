import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

export interface Migration {
  name: string;
  execute: (prisma: PrismaClient) => Promise<void>;
}

// Function to automatically discover migrations
async function discoverMigrations(): Promise<Migration[]> {
  const migrationsDir = __dirname;

  // Get all migration directories (they should start with a date)
  const migrationDirs = fs
    .readdirSync(migrationsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && /^\d{4}-\d{2}-\d{2}_/.test(dirent.name))
    .map((dirent) => dirent.name)
    .sort(); // Sort by name, which starts with the date

  const migrations: Migration[] = [];

  // For each migration directory, import its migration
  for (const dirName of migrationDirs) {
    try {
      // Use dynamic import instead of require
      const migrationModule = await import(`./${dirName}/index.js`);
      if (migrationModule.migration) {
        migrations.push(migrationModule.migration);
      } else {
        console.error(`Migration module found but no migration export in ${dirName}`);
      }
    } catch (error) {
      console.error(`Failed to import migration from ${dirName}:`, error);
    }
  }

  return migrations;
}

// Register all migrations here - now we need to make this async
let migrations: Migration[] = [];

// Initialize migrations asynchronously
export async function initMigrations(): Promise<void> {
  migrations = await discoverMigrations();
}

export async function runMigrations(prisma: PrismaClient): Promise<void> {
  // Make sure migrations are initialized
  if (migrations.length === 0) {
    await initMigrations();
  }

  console.log(`Found ${migrations.length} migrations to process`);

  // Check if Migration collection exists
  let executedMigrationNames = new Set<string>();

  try {
    // Try to access the Migration collection
    const executedMigrations = await prisma.migration.findMany();
    executedMigrationNames = new Set(executedMigrations.map((m) => m.name));
  } catch (error) {
    console.log(`Error getting executed migrations:`, error);
  }

  // Run migrations that haven't been executed yet
  for (const migration of migrations) {
    if (!executedMigrationNames.has(migration.name)) {
      try {
        await migration.execute(prisma);

        // Record the migration as executed
        try {
          await prisma.migration.create({
            data: {
              name: migration.name,
            },
          });
        } catch (error) {
          console.error(`Failed to record migration execution:`, error);
          throw error;
        }

        console.log(`Successfully executed migration: ${migration.name}`);
      } catch (error) {
        console.error(`Error executing migration ${migration.name}:`, error);
        throw error; // Re-throw to stop the server if migrations fail
      }
    } else {
      console.log(`Skipping already executed migration: ${migration.name}`);
    }
  }
}
