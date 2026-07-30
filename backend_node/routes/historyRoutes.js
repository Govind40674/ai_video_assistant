import express from "express";
import {
  saveHistory,
  getHistory,
} from "../controllers/historyController.js";

const router = express.Router();

router.post("/save_video_data/history", saveHistory);

router.get("/save_video_data/history/:email", getHistory);

export default router;