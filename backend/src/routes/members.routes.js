import { Router } from "express";
import  authMiddleware  from "../middlewares/auth.middleware.js"
import { addMember, updateMemberRole, removeMember, getMembers } from "../controllers/members.controllers.js";

const memberRoutes = Router({ mergeParams: true });

memberRoutes.post('/', authMiddleware, addMember)
memberRoutes.patch('/:memberId', authMiddleware, updateMemberRole)
memberRoutes.delete('/:memberId', authMiddleware, removeMember)
memberRoutes.get('/', authMiddleware, getMembers)

export default memberRoutes