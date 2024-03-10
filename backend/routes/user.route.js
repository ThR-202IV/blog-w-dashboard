import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);

/* 'cause we export router as a default, we are able to change its name in the component we import this, for example, in index.js, we imoprt router as UserRoutes */
export default router;
