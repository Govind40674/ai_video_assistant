import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.REACT_APP_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/", videoRoutes);
app.use("/", historyRoutes);
app.use("/", profileRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});