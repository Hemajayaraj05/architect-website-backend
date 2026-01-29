import { RequestHandler } from "express";
import {
  createProjectWithFolder,
  uploadProjectImages,
  getAllProjectsWithImages,
  deleteProjectImage,
  getProjectFolder,
} from "../services/project.service";
import {
  deleteProjectById, 
} from "../services/project.service";
export const createProjectController: RequestHandler = async (req, res) => {
  try {
    const { title, location } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await createProjectWithFolder(title, location);
    return res.status(201).json(project);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadImagesController: RequestHandler = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    if (!Array.isArray(req.files)) {
      return res.status(400).json({ message: "Invalid file upload" });
    }

    if (req.files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const folder = await getProjectFolder(projectId);
    if (!folder) return res.status(404).json({ message: "Project not found" });

    const images = await uploadProjectImages(projectId, req.files, folder);
    return res.json(images);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProjectsController: RequestHandler = async (_req, res) => {
  const projects = await getAllProjectsWithImages();
  res.json(projects);
};

export const deleteImageController: RequestHandler = async (req, res) => {
  const imageId = Number(req.params.imageId);
  if (!imageId) return res.status(400).json({ message: "Invalid image id" });

  await deleteProjectImage(imageId);
  res.json({ message: "Image deleted successfully" });
};


export const deleteProjectController: RequestHandler = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    if (!projectId) return res.status(400).json({ message: "Invalid project id" });

    await deleteProjectById(projectId);
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};