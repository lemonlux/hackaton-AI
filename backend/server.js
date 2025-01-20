import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ragRoutes from "./routes/ragRoutes.js";
import { art } from "./ascii.js";
import dotenv from "dotenv";

dotenv.config({ debug: true });

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { ignoreUndefined: true });
    console.log("MongoDB connected");
    
    app.use("/api/rag", ragRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`${art} \n\nServer running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
})();
