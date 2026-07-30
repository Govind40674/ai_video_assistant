import History from "../models/History.js";

export const saveHistory = async (req, res) => {
  try {
    const {
      user_email,
      title,
      question,
      answer,
    } = req.body;

    if (!user_email || !title || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const history = await History.create({
      user_email,
      title,
      question,
      answer,
    });

    res.status(201).json({
      success: true,
      message: "History saved successfully",
      history,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Get all history of a user
export const getHistory = async (req, res) => {
  try {
    const { email } = req.params;

    const history = await History.find({
      user_email: email,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};