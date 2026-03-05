import { Project } from "../Model/projectModel.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      category,
      status,
      progress,
      startDate,
      dueDate,
      designer,
      description,
      budget,
      spent,
      user_id,
    } = req.body;

    if (!title || !category || !startDate || !dueDate || !designer || !user_id) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const project = await Project.create({
      title,
      category,
      status,
      progress,
      startDate,
      dueDate,
      designer,
      description,
      budget,
      spent,
      user_id,
    });

    res.status(201).send({ message: "Project created", data: project });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).send({ data: projects });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).send({ message: "Project not found" });
    res.status(200).send({ data: project });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).send({ message: "Project not found" });

    const {
      title,
      category,
      status,
      progress,
      startDate,
      dueDate,
      designer,
      description,
      budget,
      spent,
    } = req.body;

    project.title = title || project.title;
    project.category = category || project.category;
    project.status = status || project.status;
    project.progress = progress ?? project.progress;
    project.startDate = startDate || project.startDate;
    project.dueDate = dueDate || project.dueDate;
    project.designer = designer || project.designer;
    project.description = description || project.description;
    project.budget = budget || project.budget;
    project.spent = spent || project.spent;

    await project.save();
    res.status(200).send({ message: "Project updated", data: project });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).send({ message: "Project not found" });

    await project.destroy();
    res.status(200).send({ message: "Project deleted" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};