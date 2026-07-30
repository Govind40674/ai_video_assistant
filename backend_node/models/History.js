import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("History", historySchema);