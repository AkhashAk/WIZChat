import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getUserById, updateNoOfNewMessages } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getUserById);
router.post("/:id", protectRoute, updateNoOfNewMessages);

export default router;
