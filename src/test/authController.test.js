import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import { User } from "../Model/userModel.js";
import * as authController from "../Controller/authController.js";

// Mock Response Helper
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = {
        body: {
          fullname: "John Doe",
          email: "john@example.com",
        },
      };
      const res = mockResponse();

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 409 if email already exists", async () => {
      const req = {
        body: {
          fullname: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      User.findOne = jest
        .fn()
        .mockResolvedValueOnce({ email: "john@example.com" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({
        message: "Email already in use",
      });
    });

    it("should return 409 if username already taken", async () => {
      const req = {
        body: {
          fullname: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      User.findOne = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ username: "johndoe" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({
        message: "Username already taken",
      });
    });

    it("should register user successfully when all validations pass", async () => {
      const req = {
        body: {
          fullname: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({
        id: 1,
        fullname: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        role: "user",
        toJSON: () => ({
          id: 1,
          fullname: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        }),
      });

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledTimes(2);
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User registered successfully",
        })
      );
    });
  });

  describe("login", () => {
    it("should return 400 if email or password missing", async () => {
      const req = {
        body: {
          email: "john@example.com",
        },
      };
      const res = mockResponse();

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        body: {
          email: "notfound@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      User.findOne = jest.fn().mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 401 if password incorrect", async () => {
      const req = {
        body: {
          email: "john@example.com",
          password: "wrongpassword",
        },
      };
      const res = mockResponse();

      User.findOne = jest.fn().mockResolvedValue({
        id: 1,
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "Password is incorrect",
      });
    });

    it("should login user successfully with valid credentials", async () => {
      const req = {
        body: {
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = mockResponse();

      const hashedPassword = await bcrypt.hash("password123", 10);

      User.findOne = jest.fn().mockResolvedValue({
        id: 1,
        email: "john@example.com",
        password: hashedPassword,
        role: "user",
        toJSON: () => ({
          id: 1,
          email: "john@example.com",
          role: "user",
        }),
      });

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});


      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "Password is incorrect",
        });
