import { Router } from "express";
import multer from "multer";
import {
  createProjectController,
  uploadImagesController,
  getProjectsController,
} from "../controllers/project.controller";
import { deleteImageController } from "../controllers/project.controller";
const router = Router();
const upload = multer({ dest: "uploads/" });

// Create a project
router.post("/projects", createProjectController);

// Upload multiple images for a project
router.post(
  "/projects/:projectId/images",
  upload.array("images", 10), // up to 10 images at once
  uploadImagesController
);

// Get all projects with their images
router.get("/projects", getProjectsController);

router.delete(
  "/projects/images/:imageId",
  deleteImageController
);


export default router;
