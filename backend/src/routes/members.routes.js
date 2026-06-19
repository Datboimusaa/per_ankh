import { Router } from "express";
import  authMiddleware  from "../middlewares/auth.middleware.js"
import { addMember, updateMemberRole, removeMember, getMembers } from "../controllers/members.controllers.js";

const memberRoutes = Router();

memberRoutes.post('/:workspaceId/members', authMiddleware, addMember)
memberRoutes.patch('/:workspaceId/members/:memberId', authMiddleware, updateMemberRole)
memberRoutes.delete('/:workspaceId/members/:memberId', authMiddleware, removeMember)
memberRoutes.get('/:workspaceId/members', authMiddleware, getMembers)

export default memberRoutes