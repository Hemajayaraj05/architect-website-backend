import { Router } from "express";
import {
  createReviewController,
  getAllReviewsController,
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/review.controller";

const router = Router();

// Create a new review
router.post("/reviews", createReviewController);

// Get all reviews
router.get("/reviews", getAllReviewsController);

// Get a single review by ID
router.get("/reviews/:id", getReviewByIdController);

// Update a review
router.put("/reviews/:id", updateReviewController);

// Delete a review
router.delete("/reviews/:id", deleteReviewController);

export default router;
