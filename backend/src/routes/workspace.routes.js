import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import { getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace, createWorkspace } from '../controllers/workspace.controllers.js';

const workspaceRoutes = Router();

workspaceRoutes.post('/create', authMiddleware, upload.single('avatar'), createWorkspace);
workspaceRoutes.get('/', authMiddleware, getWorkspaces);
workspaceRoutes.get('/:id', authMiddleware, getWorkspace)
workspaceRoutes.patch('/:id', authMiddleware, upload.single('avatar'), updateWorkspace);
workspaceRoutes.delete('/:id', authMiddleware, deleteWorkspace);

export default workspaceRoutes