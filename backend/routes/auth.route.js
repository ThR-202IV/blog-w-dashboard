import express from "express";
import { signup, signin, google } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

/* 'cause we export router as a default, we are able to change its name in the component we import this, for example, in index.js, we imoprt router as authRoutes */
export default router;
