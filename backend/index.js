import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log("Connection to the Database is successful! ——"))
  .catch((error) => console.log(`Error: ${error} ——`));

/* resolving dirname for ES module */
const __filename = fileURLToPath(import.meta.url);
/* __dirname gives the directory of the place where our project is available. Whilst in localhost it is the folder where it is stored but when it is uploaded to render, it will be different */
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000 ——");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

/* static folder will represent our frontend side. If VITE is used (like in this project), but if 'npx create-react-app' is used it should be "/build". This statement will find the folder and run index.html */
app.use(express.static(path.join(__dirname, "/frontend/dist")));

/* render frontend to any path that the user goes to */
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
);

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
