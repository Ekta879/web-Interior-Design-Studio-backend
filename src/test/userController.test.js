import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import { User } from "../Model/userModel.js";
import * as userController from "../Controller/userController.js";

// Mock Response Helper
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller (minimal)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all users", async () => {
    User.findAll = jest.fn().mockResolvedValue([{ id: 1, fullname: "Test" }]);
    const req = {};
    const res = mockResponse();

    await userController.getAll(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      data: [{ id: 1, fullname: "Test" }],
      message: "Users retrieved successfully",
    });
  });
});