import { Booking } from "../Model/bookingModel.js";

export const createBooking = async (req, res) => {
  try {
    const {
      date,
      time,
      projectType,
      clientName,
      email,
      phone,
      description,
    } = req.body;

    if (!date || !time || !projectType || !clientName || !email || !phone) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      date,
      time,
      projectType,
      clientName,
      email,
      phone,
      description,
    });

    res.status(201).send({ message: "Booking created", data: booking });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).send({ data: bookings });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).send({ message: "Booking not found" });
    res.status(200).send({ data: booking });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).send({ message: "Booking not found" });

    const {
      date,
      time,
      projectType,
      clientName,
      email,
      phone,
      description,
      status,
    } = req.body;

    booking.date = date || booking.date;
    booking.time = time || booking.time;
    booking.projectType = projectType || booking.projectType;
    booking.clientName = clientName || booking.clientName;
    booking.email = email || booking.email;
    booking.phone = phone || booking.phone;
    booking.description = description || booking.description;
    booking.status = status || booking.status;

    await booking.save();
    res.status(200).send({ message: "Booking updated", data: booking });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).send({ message: "Booking not found" });

    await booking.destroy();
    res.status(200).send({ message: "Booking deleted" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};