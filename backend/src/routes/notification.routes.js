import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controllers.js";

const notificationRoutes = Router();

notificationRoutes.get("/", authMiddleware, getNotifications);
notificationRoutes.patch("/mark-all", authMiddleware, markAllAsRead);
notificationRoutes.patch("/:notificationId/read", authMiddleware, markAsRead);

export default notificationRoutes;