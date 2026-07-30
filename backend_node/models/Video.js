import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    action_items: {
      type: String,
      default: "",
    },

    key_decisions: {
      type: String,
      default: "",
    },

    questions: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);