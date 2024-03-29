import express from "express";

import {
  test,
  updateUser,
  deleteUser,
  signout,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
/* this getusers is for the admin and therefore can't be used for a general display */
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);

/* 'cause we export router as a default, we are able to change its name in the component we import this, for example, in index.js, we imoprt router as userRoutes */
export default router;
