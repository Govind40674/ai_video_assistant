import express from "express";
import {
  saveVideo,
  getVideos,
  getVideoById,
} from "../controllers/videoController.js";

const router = express.Router();

router.post("/save_video_data", saveVideo);

// All saved videos (Newest First)
router.get("/save_video_data/:email", getVideos);

// One video details
router.get("/save_video_data/details/:id", getVideoById);

export default router;