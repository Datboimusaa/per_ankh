import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createComment, updateComment, deleteComment } from "../controllers/comment.controllers.js";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", authMiddleware, createComment);
commentRoutes.patch("/:commentId", authMiddleware, updateComment);
commentRoutes.delete("/:commentId", authMiddleware, deleteComment);

export default commentRoutes;