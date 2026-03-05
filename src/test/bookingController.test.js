import { jest } from "@jest/globals";
import { Booking } from "../Model/bookingModel.js";
import * as bookingController from "../Controller/bookingController.js";

// helper
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Booking Controller", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create booking successfully", async () => {
    const req = { body: { date: "2026-04-01", time: "10:00", projectType: "Residential", clientName: "Test", email: "test@example.com", phone: "12345678" } };
    const res = mockResponse();
    Booking.create = jest.fn().mockResolvedValue(req.body);

    await bookingController.createBooking(req, res);

    expect(Booking.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return all bookings", async () => {
    const req = {};
    const res = mockResponse();
    Booking.findAll = jest.fn().mockResolvedValue([{ id: 1 }]);

    await bookingController.getAllBookings(req, res);

    expect(Booking.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});