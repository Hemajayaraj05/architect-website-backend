import { Request, Response } from "express";
import {
  createProjectWithFolder,
  uploadProjectImages,
  getAllProjectsWithImages,
  deleteProjectImage,
  getProjectFolder,
} from "../services/project.service";


export const createProjectController = async (req: Request, res: Response) => {
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
      error: error.message ?? error,
    });
  }
};


export const uploadImagesController = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);

  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  const folder = await getProjectFolder(projectId);
  if (!folder) {
    return res.status(404).json({ message: "Project not found" });
  }

  const files = req.files as Express.Multer.File[];
  const imageUrls = await uploadProjectImages(projectId, files, folder);

  res.json(imageUrls);
};


export const getProjectsController = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjectsWithImages();
    res.json(projects);
  } catch (error: any) {
    console.error("GET PROJECTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};


export const deleteImageController = async (req: Request, res: Response) => {
  try {
    const imageId = Number(req.params.imageId);
    if (!imageId) return res.status(400).json({ message: "Invalid image id" });

    await deleteProjectImage(imageId);
    res.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("DELETE IMAGE ERROR:", error);
    res.status(400).json({ message: "Failed to delete image", error: error.message });
  }
};
