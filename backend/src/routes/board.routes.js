import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createBoard, getBoards, getBoard, updateBoard, deleteBoard } from "../controllers/board.controllers.js";

const boardRoutes = Router({ mergeParams: true });

boardRoutes.post("/", authMiddleware, createBoard);
boardRoutes.get("/", authMiddleware, getBoards);
boardRoutes.get("/:boardId", authMiddleware, getBoard);
boardRoutes.patch("/:boardId", authMiddleware, updateBoard);
boardRoutes.delete("/:boardId", authMiddleware, deleteBoard);

export default boardRoutes;