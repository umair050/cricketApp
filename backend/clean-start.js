// Complete clean start script
const { Client } = require("pg");

async function cleanStart() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "cricketapp",
    database: process.env.DB_DATABASE || "cricketapp",
  });

  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    // Drop ALL match-related tables (old and new names)
    const tables = [
      "balls",
      "scorecards",
      "matches",
      "tournament_teams", // Old name
      "match_tournament_teams", // New name
      "tournament_groups",
    ];

    console.log("🗑️  Dropping all match-related tables...\n");
    for (const table of tables) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
        console.log(`✅ Dropped: ${table}`);
      } catch (error) {
        console.log(`⚠️  ${table} not found (ok)`);
      }
    }

    console.log("\n✅ All match tables dropped!");
    console.log("\n🚀 NEXT STEPS:");
    console.log("   1. Restart backend: npm run start:dev");
    console.log("   2. Tables will be created fresh");
    console.log("   3. No more errors!\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

cleanStart();


