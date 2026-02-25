import { RequestHandler } from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/review.service";

export const createReviewController: RequestHandler = async (req, res) => {
  try {
    const { project_name, client_name, place, review, stars } = req.body;

    // Validation
    if (!project_name || !client_name || !place || !review || !stars) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    const newReview = await createReview({
      project_name,
      client_name,
      place,
      review,
      stars: Number(stars),
    });

    return res.status(201).json(newReview);
  } catch (error: any) {
    console.error("Create review error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllReviewsController: RequestHandler = async (_req, res) => {
  try {
    const reviews = await getAllReviews();
    return res.json(reviews);
  } catch (error: any) {
    console.error("Get reviews error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getReviewByIdController: RequestHandler = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    if (!reviewId) {
      return res.status(400).json({ message: "Invalid review id" });
    }

    const review = await getReviewById(reviewId);
    return res.json(review);
  } catch (error: any) {
    console.error("Get review error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateReviewController: RequestHandler = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    const { project_name, client_name, place, review, stars } = req.body;

    if (!reviewId) {
      return res.status(400).json({ message: "Invalid review id" });
    }

    // Validation
    if (!project_name || !client_name || !place || !review || !stars) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    const updatedReview = await updateReview(reviewId, {
      project_name,
      client_name,
      place,
      review,
      stars: Number(stars),
    });

    return res.json(updatedReview);
  } catch (error: any) {
    console.error("Update review error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteReviewController: RequestHandler = async (req, res) => {
  try {
    const reviewId = Number(req.params.id);

    if (!reviewId) {
      return res.status(400).json({ message: "Invalid review id" });
    }

    await deleteReview(reviewId);
    return res.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Delete review error:", error);
    return res.status(500).json({ message: error.message });
  }
};
