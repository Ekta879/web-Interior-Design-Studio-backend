import express from "express";
import cors from "cors";
import { connection } from "./src/Database/db.js";

// make sure all model definitions are evaluated before syncing
import "./src/Model/userModel.js";
import "./src/Model/projectModel.js";
import "./src/Model/designModel.js";
import "./src/Model/bookingModel.js";
import { createAdminIfNotExists } from "./src/Model/createAdmin.js";

// routes
import bookingRoutes from "./src/Routes/bookingRoutes.js";
import userRoutes from "./src/Routes/userRoutes.js";
import projectRoutes from "./src/Routes/projectRoutes.js";
import designRoutes from "./src/Routes/designRoutes.js";
import authRoutes from "./src/Routes/authRoutes.js";

console.log("Starting server setup...");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH","PUT", "DELETE"],
  credentials: true,
}));

// parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/projects", projectRoutes);

console.log("Connecting to database...");
connection()
  .then(async () => {
    console.log("Database connected, creating admin...");
    await createAdminIfNotExists();
    console.log("Starting server...");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

// Test route
app.get("/", (req, res) => res.send("Interior Design API is running"));