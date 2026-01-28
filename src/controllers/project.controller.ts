import { RequestHandler } from "express";
import {
  createProjectWithFolder,
  uploadProjectImages,
  getAllProjectsWithImages,
  deleteProjectImage,
  getProjectFolder,
} from "../services/project.service";

export const createProjectController: RequestHandler = async (req, res) => {
  try {
    const { title, location } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const project = await createProjectWithFolder(title, location);
    return res.status(201).json(project);
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);
    return res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

export const uploadImagesController: RequestHandler = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    // 🔥 THE FIX: Narrow Multer's union type
    if (!Array.isArray(req.files)) {
      return res.status(400).json({ message: "Invalid file upload" });
    }

    const files = req.files; // ✅ File[]

    if (files.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const folder = await getProjectFolder(projectId);
    if (!folder) {
      return res.status(404).json({ message: "Project not found" });
    }

    const imageUrls = await uploadProjectImages(projectId, files, folder);
    return res.json(imageUrls);
  } catch (error: any) {
    console.error("UPLOAD IMAGES ERROR:", error);
    return res.status(500).json({
      message: "Failed to upload images",
      error: error.message,
    });
  }
};

export const getProjectsController: RequestHandler = async (_req, res) => {
  try {
    const projects = await getAllProjectsWithImages();
    return res.json(projects);
  } catch (error: any) {
    console.error("GET PROJECTS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

export const deleteImageController: RequestHandler = async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);

    if (!imageId) {
      return res.status(400).json({ message: "Invalid image id" });
    }

    await deleteProjectImage(imageId);
    return res.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("DELETE IMAGE ERROR:", error);
    return res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};
