import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Match Next.js environment precedence for local development while retaining
// `.env` as a fallback for non-Next Prisma CLI commands.
config({ path: [".env.local", ".env"] });

const placeholderPattern = /USERNAME|PASSWORD|something|your-endpoint|REGION|CHANGE_ME/i;

const directUrl = process.env.DIRECT_URL;
const databaseUrl = process.env.DATABASE_URL;
const migrationUrl =
  directUrl && !placeholderPattern.test(directUrl) ? directUrl : databaseUrl;

if (!migrationUrl || placeholderPattern.test(migrationUrl)) {
  throw new Error(
    "A real DIRECT_URL or DATABASE_URL is required for Prisma CLI commands. Placeholder connection strings are not valid."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --import tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl,
  },
});
