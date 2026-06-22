import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { attachFile, deleteFile } from "../controllers/file.controllers.js";

const fileRoutes = Router({ mergeParams: true });

// Read the uploaded field named "file" out from FormData payload
fileRoutes.post("/", authMiddleware, upload.single("file"), attachFile);
fileRoutes.delete("/:fileId", authMiddleware, deleteFile);

export default fileRoutes;