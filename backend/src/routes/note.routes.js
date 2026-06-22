import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createNote, updateNote, deleteNote } from "../controllers/note.controllers.js";

const noteRoutes = Router({ mergeParams: true });

noteRoutes.post("/", authMiddleware, createNote);
noteRoutes.patch("/:noteId", authMiddleware, updateNote);
noteRoutes.delete("/:noteId", authMiddleware, deleteNote);

export default noteRoutes;