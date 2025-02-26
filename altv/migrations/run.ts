import { PrismaClient } from "@prisma/client";
import { runMigrations, initMigrations } from "./index";

async function main() {
  // Get database URL from command line or use default
  const databaseUrl = process.env.DATABASE_URL;

  // Create a modified URL for direct connection if needed
  const modifiedUrl = databaseUrl?.includes("127.0.0.1")
    ? databaseUrl.includes("directConnection")
      ? databaseUrl
      : `${databaseUrl}&directConnection=true`
    : databaseUrl;

  // Set environment variable for any code that reads from process.env
  process.env.DATABASE_URL = modifiedUrl;

  // Create PrismaClient with explicit datasource URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: modifiedUrl,
      },
    },
  });

  try {
    await prisma.$connect();

    // Initialize migrations
    await initMigrations();

    // Run migrations
    await runMigrations(prisma);
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
