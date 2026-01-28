import { Router } from "express";
import multer from "multer";
import {
  createProjectController,
  uploadImagesController,
  getProjectsController,
  deleteImageController,
} from "../controllers/project.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/projects", createProjectController);

router.post(
  "/projects/:projectId/images",
  upload.array("images", 20),
  uploadImagesController
);

router.get("/projects", getProjectsController);

router.delete("/projects/images/:imageId", deleteImageController);

export default router;
