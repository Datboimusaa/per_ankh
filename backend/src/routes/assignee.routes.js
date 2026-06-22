import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { assignMember, unassignMember, getTaskAssignees } from "../controllers/assignee.controllers.js";

const assigneeRoutes = Router({ mergeParams: true });

assigneeRoutes.get("/", authMiddleware, getTaskAssignees);
assigneeRoutes.post("/", authMiddleware, assignMember);
assigneeRoutes.delete("/:memberId", authMiddleware, unassignMember);

export default assigneeRoutes