import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// 1. Cek apakah DATABASE_URL terbaca
console.log(
  "DATABASE_URL IS:",
  process.env.DATABASE_URL ? "LOADED" : "UNDEFINED / MISSING!",
);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing! Check your .env file path.");
}

export default defineConfig({
  out: "./src/drizzle",
  schema: ["./src/drizzle/schema.ts", "./src/db/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    // Jika konek ke database cloud (Supabase/Neon/Aiven/dll) atau butuh SSL:
    // ssl: false, // <-- Coba un-comment/set false jika pakai local postgres
  },
});
