import Video from "../models/Video.js";

export const saveVideo = async (req, res) => {
  try {
    const {
      user_email,
      title,
      summary,
      action_items,
      key_decisions,
      questions,
    } = req.body;

    if (!user_email || !title) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const video = await Video.create({
      user_email,
      title,
      summary,
      action_items,
      key_decisions,
      questions,
    });

    res.status(201).json({
      success: true,
      video,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// Get all videos of a user (Newest First)
export const getVideos = async (req, res) => {
  try {
    const { email } = req.params;

    const videos = await Video.find({
      user_email: email,
    })
      .select("title createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Get one video details
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};