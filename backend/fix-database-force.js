// Aggressive database fix - drops ALL constraints first
// Run with: node fix-database-force.js

const { Client } = require("pg");

async function fixDatabaseForce() {
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

    // First, drop ALL foreign key constraints on tournament_teams
    console.log("\n🔧 Dropping all constraints...");
    
    const dropConstraints = `
      DO $$ 
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT constraint_name 
                    FROM information_schema.table_constraints 
                    WHERE table_name = 'tournament_teams' 
                    AND constraint_type = 'FOREIGN KEY') 
          LOOP
              EXECUTE 'ALTER TABLE tournament_teams DROP CONSTRAINT IF EXISTS ' || r.constraint_name || ' CASCADE';
          END LOOP;
      END $$;
    `;
    
    try {
      await client.query(dropConstraints);
      console.log("✅ Dropped foreign key constraints");
    } catch (e) {
      console.log("⚠️  No constraints to drop");
    }

    // Drop all match-related tables in correct order
    const tables = [
      "balls",
      "scorecards", 
      "matches",
      "tournament_teams",
      "tournament_groups",
    ];

    console.log("\n🗑️  Dropping tables...");
    for (const table of tables) {
      try {
        await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Table ${table} doesn't exist`);
      }
    }

    console.log("\n✅ Database cleaned successfully!");
    console.log("\n🚀 Now restart your backend:");
    console.log("   cd backend");
    console.log("   npm run start:dev");
    console.log("\n📊 Tables will be created fresh with correct schema.\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n💡 Make sure:");
    console.error("   1. PostgreSQL is running");
    console.error('   2. Database "cricketapp" exists');
    console.error("   3. Backend server is STOPPED");
    console.error("   4. Credentials are correct");
  } finally {
    await client.end();
  }
}

fixDatabaseForce();



