import { Router } from "express"
import upload from "../middlewares/upload.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMe, updateMe } from "../controllers/user.controllers.js"
 
const userRoutes = Router();

userRoutes.get('/me', authMiddleware, getMe)
userRoutes.patch('/me', authMiddleware, upload.single('avatar'), updateMe)

export default userRoutes