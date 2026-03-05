import express from "express";
import cors from "cors";
import { Sequelize } from "sequelize";

// Create in-memory SQLite database for testing
const testSequelize = new Sequelize('sqlite::memory:', {
  logging: false
});

// Define Booking model for testing
const Booking = testSequelize.define('Booking', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  time: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  projectType: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  clientName: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING(20),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: "pending",
  },
});

const app = express();

app.use(cors());
app.use(express.json());

// Booking routes for testing
app.post("/api/bookings", async (req, res) => {
  try {
    const { date, time, projectType, clientName, email, phone, description } = req.body;

    if (!date || !time || !projectType || !clientName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      date, time, projectType, clientName, email, phone, description
    });

    res.status(201).json({ message: "Booking created", data: booking });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ data: bookings });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ data: booking });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.patch("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { date, time, projectType, clientName, email, phone, description, status } = req.body;

    booking.date = date || booking.date;
    booking.time = time || booking.time;
    booking.projectType = projectType || booking.projectType;
    booking.clientName = clientName || booking.clientName;
    booking.email = email || booking.email;
    booking.phone = phone || booking.phone;
    booking.description = description || booking.description;
    booking.status = status || booking.status;

    await booking.save();
    res.status(200).json({ message: "Booking updated", data: booking });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.status(200).json({ message: "Booking deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Test server running with in-memory database" });
});

// Initialize database and start server
const initDB = async () => {
  await testSequelize.authenticate();
  await testSequelize.sync({ force: true });
  console.log("Test database initialized");
};

initDB().then(() => {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
});