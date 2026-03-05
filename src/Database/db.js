import { Sequelize } from "sequelize";
import pkg from "pg";
const { Client } = pkg;

const dbName = "Interior_db";
const dbUser = "postgres";
const dbPassword = "217652";
const dbHost = "localhost";

// Main connection with database
export const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: "postgres",
    logging: false,
  }
);

export const connection = async () => {
  try {
    // First, create the database if it doesn't exist
    console.log("Checking/Creating database...");
    const client = new Client({
      user: dbUser,
      password: dbPassword,
      host: dbHost,
      port: 5432,
    });

    try {
      await client.connect();
      // Check if database exists, if not create it
      const result = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
      
      if (result.rows.length === 0) {
        console.log(`Creating database ${dbName}...`);
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database ${dbName} created successfully`);
      } else {
        console.log(`Database ${dbName} already exists`);
      }
    } finally {
      await client.end();
    }

    // Now connect to the actual database and sync models
    await sequelize.authenticate();
    console.log("Connected to database successfully");
    
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (e) {
    console.error("Database connection failed:", e.message);
    process.exit(1);
  }
};