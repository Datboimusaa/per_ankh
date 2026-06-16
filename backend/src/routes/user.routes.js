import { Router } from "express"
import upload from "../middlewares/imageUpload.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMe, updateMe } from "../controllers/user.controllers.js"
 
const userRoutes = Router();

userRoutes.get('/', authMiddleware, getMe)
userRoutes.patch('/', authMiddleware, uplaod.single('avatar'), updateMe)

export default userRoutes