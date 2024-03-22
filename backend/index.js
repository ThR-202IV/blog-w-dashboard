import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log("Connection to the Database is successful! ——"))
  .catch((error) => console.log(`Error: ${error} ——`));

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000 ——");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

/* this error is the error that comes from the input. The error passed by the next method that manages the errorHandler comes here */
app.use((error, req, res, next) => {
  /* statusCode comes from the error */
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
