import axios from "axios";

import User from "../models/User.js";
import Video from "../models/Video.js";
import History from "../models/History.js";

export const getProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Delete user
    await User.deleteOne({ email });

    // Delete saved videos
    await Video.deleteMany({
      user_email: email,
    });

    // Delete history
    await History.deleteMany({
      user_email: email,
    });

    // Call FastAPI to delete vector store
    try {
      await axios.delete(`${process.env.FASTAPI_URL}/delete_user`, {
        params: {
          user_email: email,
        },
      });
    } catch (err) {
      console.error("FastAPI vector store deletion failed:", err.message);
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
