// test-pg.mjs
import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

console.log("Mencoba konek ke DB...");
try {
  await client.connect();
  console.log("✅ KONEKSI SUKSES!");
  const res = await client.query("SELECT NOW()");
  console.log("Waktu DB:", res.rows[0]);
  await client.end();
} catch (err) {
  console.error("❌ DETAIL ERROR DARI POSTGRES:");
  console.error(err);
}
