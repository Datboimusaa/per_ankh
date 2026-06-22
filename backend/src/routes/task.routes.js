import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express"
import { createTask, updateTask, deleteTask, getTask } from "../controllers/tasks.controllers.js"

const taskRoutes = Router({ mergeParams: true });

taskRoutes.post('/', authMiddleware, createTask);
taskRoutes.get('/:taskId', authMiddleware, getTask);
taskRoutes.patch('/:taskId', authMiddleware, updateTask);
taskRoutes.delete('/:taskId', authMiddleware, deleteTask);

export default taskRoutes