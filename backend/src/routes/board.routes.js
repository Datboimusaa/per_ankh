import prisma from "../config/prisma.js"
import { Router } from "express"
import authMiddleware from "../middlewares/auth.middleware.js";
import { createBoard, getBoards, getBoard, updateBoard, deleteBoard } from "../controllers/board.controllers.js";

const boardRoutes = Router();

boardRoutes.post("/:workspaceId/boards", authMiddleware, createBoard);
boardRoutes.get("/:workspaceId/boards", authMiddleware, getBoards);
boardRoutes.get("/:workspaceId/boards/:boardId", authMiddleware, getBoard);
boardRoutes.patch("/:workspaceId/boards/:boardId", authMiddleware, updateBoard);
boardRoutes.delete("/:workspaceId/boards/:boardId", authMiddleware, deleteBoard);

export default boardRoutes