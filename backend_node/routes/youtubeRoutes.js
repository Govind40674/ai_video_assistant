import express from "express";
import { downloadAudio } from "../controllers/youtubeController.js";

const router = express.Router();

router.post("/download", downloadAudio);

export default router;