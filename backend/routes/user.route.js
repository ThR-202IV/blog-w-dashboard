import express from "express";

import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);

/* 'cause we export router as a default, we are able to change its name in the component we import this, for example, in index.js, we imoprt router as userRoutes */
export default router;
