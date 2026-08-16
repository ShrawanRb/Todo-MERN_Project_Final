import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import todoRoute from "../backend/routes/todo.route.js";
import userRoute from "../backend/routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;
const DB_URL = process.env.MONGODB_URL;

await mongoose.connect(DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));
  //routes
  app.use(express.json());
 app.use("/todo",todoRoute) ; 
 app.use("/user",userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});