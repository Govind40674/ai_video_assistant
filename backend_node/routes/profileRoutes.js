import express from "express";
import {
  getProfile,
  deleteAccount,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/profile/:email", getProfile);

router.delete("/delete_account", deleteAccount);

export default router;