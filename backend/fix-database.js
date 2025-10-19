// Quick fix script for database schema conflicts
// Run with: node fix-database.js

const { Client } = require("pg");

async function fixDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "cricketapp",
    database: process.env.DB_DATABASE || "cricketapp",
  });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Drop conflicting tables
    const tables = [
      "tournament_teams",
      "balls",
      "scorecards",
      "matches",
      "tournament_groups",
    ];

    for (const table of tables) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Table ${table} doesn't exist or already dropped`);
      }
    }

    console.log("\n✅ Database cleaned successfully!");
    console.log("\n🚀 Now restart your backend:");
    console.log("   cd backend");
    console.log("   npm run start:dev");
    console.log(
      "\n📊 The tables will be auto-created with the correct schema.\n"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n💡 Make sure:");
    console.error("   1. PostgreSQL is running");
    console.error('   2. Database "cricketapp" exists');
    console.error("   3. Credentials in .env are correct");
  } finally {
    await client.end();
  }
}

fixDatabase();


