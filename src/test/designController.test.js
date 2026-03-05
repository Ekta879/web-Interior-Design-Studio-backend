import { jest } from "@jest/globals";
import { Design } from "../Model/designModel.js";
import { User } from "../Model/userModel.js";
import * as designController from "../Controller/designController.js";

// Mock Response Helper
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Design Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadDesign", () => {
    it("should upload design successfully", async () => {
      const req = {
        body: {
          title: "Modern Living Room",
          description: "A modern living room design",
          category: "Living Room",
          user_id: 1,
        },
        file: {
          filename: "design_001.jpg",
          mimetype: "image/jpeg",
        },
      };
      const res = mockResponse();

      Design.create = jest.fn().mockResolvedValue({
        id: 1,
        title: "Modern Living Room",
        description: "A modern living room design",
        category: "Living Room",
        user_id: 1,
        file_path: "design_001.jpg",
        file_type: "image/jpeg",
      });

      await designController.uploadDesign(req, res);

      expect(Design.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Design uploaded successfully",
        })
      );
    });

    it("should return 400 if file is missing", async () => {
      const req = {
        body: {
          title: "Modern Living Room",
          description: "A modern living room design",
          category: "Living Room",
          user_id: 1,
        },
        file: null,
      };
      const res = mockResponse();

      await designController.uploadDesign(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "File is required",
      });
    });

    it("should return 500 on database error", async () => {
      const req = {
        body: {
          title: "Modern Living Room",
          description: "A modern living room design",
          category: "Living Room",
          user_id: 1,
        },
        file: {
          filename: "design_001.jpg",
          mimetype: "image/jpeg",
        },
      };
      const res = mockResponse();

      Design.create = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await designController.uploadDesign(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  describe("getAllDesigns", () => {
    it("should return all designs with author info", async () => {
      const designsMockData = [
        {
          id: 1,
          title: "Design 1",
          description: "Description 1",
          category: "Living Room",
          createdAt: "2026-03-01",
          User: {
            username: "johndoe",
            fullname: "John Doe",
          },
          file_path: "design_001.jpg",
          file_type: "image/jpeg",
        },
        {
          id: 2,
          title: "Design 2",
          description: "Description 2",
          category: "Bedroom",
          createdAt: "2026-03-02",
          User: {
            username: "janedoe",
            fullname: "Jane Doe",
          },
          file_path: "design_002.jpg",
          file_type: "image/jpeg",
        },
      ];

      const req = {};
      const res = mockResponse();

      Design.findAll = jest.fn().mockResolvedValue(designsMockData);

      await designController.getAllDesigns(req, res);

      expect(Design.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.any(Array),
        })
      );
    });

    it("should handle database error in getAllDesigns", async () => {
      const req = {};
      const res = mockResponse();

      Design.findAll = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await designController.getAllDesigns(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });

  describe("getMyDesigns", () => {
    it("should return user's designs", async () => {
      const designsMockData = [
        {
          id: 1,
          title: "My Design 1",
          description: "Description 1",
          category: "Living Room",
          user_id: 1,
          User: {
            fullname: "John Doe",
          },
          file_path: "design_001.jpg",
          file_type: "image/jpeg",
        },
      ];

      const req = {
        query: {
          user_id: 1,
        },
      };
      const res = mockResponse();

      Design.findAll = jest.fn().mockResolvedValue(designsMockData);

      await designController.getMyDesigns(req, res);

      expect(Design.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { user_id: 1 },
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return empty array if user has no designs", async () => {
      const req = {
        query: {
          user_id: 999,
        },
      };
      const res = mockResponse();

      Design.findAll = jest.fn().mockResolvedValue([]);

      await designController.getMyDesigns(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle error in getMyDesigns", async () => {
      const req = {
        query: {
          user_id: 1,
        },
      };
      const res = mockResponse();

      Design.findAll = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await designController.getMyDesigns(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Database error",
      });
    });
  });
});
