import fs from "fs";
import path from "path";

import { Design } from "../Model/designModel.js";
import { User } from "../Model/userModel.js";

export const uploadDesign = async (req, res) => {
  try {
    const { title, description, category, user_id } = req.body;

    if (!req.file) {
      return res.status(400).send({ message: "File is required" });
    }

    const design = await Design.create({
      title,
      description,
      category,
      user_id,
      file_path: req.file.filename,
      file_type: req.file.mimetype,
    });

    res.status(201).send({
      message: "Design uploaded successfully",
      data: design,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Get all designs with author info
export const getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.findAll({
      include: [
        {
          model: User,
          attributes: ["fullname", "username"],
        },
      ],
    });

    const result = designs.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category,
      createdAt: m.createdAt,
      author: m.User?.username || "Unknown",
      file_path: m.file_path,
      file_type: m.file_type,
    }));

    res.status(200).send({ data: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const getMyDesigns = async (req, res) => {
  try {
    const { user_id } = req.query;

    const designs = await Design.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["fullname"],
        },
      ],
    });

    const result = designs.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category,
      createdAt: m.createdAt,
      author: m.User?.fullname || "You",
      file_path: m.file_path,
      file_type: m.file_type,
    }));

    res.status(200).send({ data: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const downloadDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await Design.findByPk(id);
    if (!design) return res.status(404).send({ message: "Design not found" });

    const filePath = path.resolve("./uploads/designs", design.file_path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: "File not found on server" });
    }

    res.download(filePath, design.file_path);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await Design.findByPk(id);
    if (!design) return res.status(404).send({ message: "Design not found" });

    const filePath = path.resolve("./uploads/designs", design.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await design.destroy();
    res.status(200).send({ message: "Design deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const design = await Design.findByPk(id);
    if (!design) return res.status(404).send({ message: "Design not found" });

    design.title = title || design.title;
    design.description = description || design.description;
    design.category = category || design.category;

    await design.save();

    res.status(200).send({ message: "Design updated successfully", data: design });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};