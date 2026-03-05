import express from "express";
import cors from "cors";
import { connection } from "./src/Database/db.js";

// make sure all model definitions are evaluated before syncing
import "./src/Model/userModel.js";
import "./src/Model/projectModel.js";
import "./src/Model/designModel.js";
import "./src/Model/bookingModel.js";
import { createAdminIfNotExists } from "./src/Model/createAdmin.js"; // helper function

// routes
import bookingRoutes from "./src/Routes/bookingRoutes.js";
import userRoutes from "./src/Routes/userRoutes.js";
import projectRoutes from "./src/Routes/projectRoutes.js";
import designRoutes from "./src/Routes/designRoutes.js";
import authRoutes from "./src/Routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// mount route handlers
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/auth", authRoutes);

// Start the server only after database connection is established
const startServer = async () => {
  try {
    await connection(); // connect database (sync happens inside)
    
    app.listen(5001, () => {
      console.log("Server running on port 5001");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();