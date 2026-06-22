import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createColumn, updateColumn, deleteColumn } from "../controllers/columns.controllers.js";

const columnRoutes = Router({ mergeParams: true });

columnRoutes.post('/', authMiddleware, createColumn);
columnRoutes.patch('/:columnId', authMiddleware, updateColumn);
columnRoutes.delete('/:columnId', authMiddleware, deleteColumn);

export default columnRoutes;