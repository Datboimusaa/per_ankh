import prisma from "../config/prisma.js"
import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware.js";

const boardRoutes = Router();

boardRoutes.post("/", authMiddleware);
boardRoutes.get("/", authMiddleware);
boardRoutes.get("/:id", authMiddleware);
boardRoutes.patch("/:id", authMiddleware);
boardRoutes.delete("/:id", authMiddleware);

export default boardRoutes