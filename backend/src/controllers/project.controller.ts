import { Request, Response } from "express";
import {
  createProject,
  uploadProjectImages,
  getAllProjectsWithImages,
} from "../services/project.service";
import { getProjectFolder } from "../services/project.service";
import { deleteProjectImage } from "../services/project.service";
import { createProjectWithFolder } from "../services/project.service";


export const createProjectController = async (req: Request, res: Response) => {
  const { title, location } = req.body;

  const project = await createProjectWithFolder(title, location);
  res.status(201).json(project);
};



export const uploadImagesController = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  console.log("PARAM projectId:", req.params.projectId);
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: "No images provided" });
  }

  const folder = await getProjectFolder(projectId);
   console.log("FOLDER FROM DB:", folder);
  if (!folder) {
    return res.status(404).json({ message: "Project not found" });
  }

  const files = req.files as Express.Multer.File[];
  const imageUrls = await uploadProjectImages(projectId, files, folder);

  res.json(imageUrls);
};



export const getProjectsController = async (req: Request, res: Response) => {
  const projects = await getAllProjectsWithImages();
  res.json(projects);
};

export const deleteImageController = async (req: Request, res: Response) => {
  try {
    const imageId = Number(req.params.imageId);
    if (!imageId) return res.status(400).json({ message: "Invalid image id" });

    await deleteProjectImage(imageId);
    res.json({ message: "Image deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete image" });
  }
};


