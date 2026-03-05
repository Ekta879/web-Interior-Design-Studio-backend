import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "Interior_db",
  "postgres",
  "217652",
  {
    host: "localhost",
    dialect: "postgres",
    logging: false, // Disable SQL logging for cleaner output
  }
);

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...\n");

  try {
    // Test basic connection
    await sequelize.authenticate();
    console.log("✅ Database authentication successful!");

    // Test if we can execute a simple query
    const [results] = await sequelize.query("SELECT version()");
    console.log("✅ Query execution successful!");
    console.log("📊 PostgreSQL Version:", results[0].version);

    // Test if our database exists and we can access it
    const [tables] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log("✅ Database schema accessible!");
    console.log(`📋 Tables found: ${tables.length}`);

    if (tables.length > 0) {
      console.log("📝 Tables in database:");
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    console.log("\n🎉 Database connection is working perfectly!");

  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Error details:", error.message);

    if (error.message.includes("does not exist")) {
      console.log("\n💡 Suggestion: Create the database first:");
      console.log("   Run: createdb -U postgres Interior_db");
    } else if (error.message.includes("password authentication failed")) {
      console.log("\n💡 Suggestion: Check your PostgreSQL credentials");
    } else if (error.message.includes("connect ECONNREFUSED")) {
      console.log("\n💡 Suggestion: Make sure PostgreSQL is running");
      console.log("   On Windows: Check Services for 'postgresql-x64-XX'");
      console.log("   On Linux/Mac: Run 'sudo systemctl start postgresql'");
    }
  } finally {
    await sequelize.close();
  }
}

testDatabaseConnection();