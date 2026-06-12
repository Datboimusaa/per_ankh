import { Router } from 'express';
import { login, logout, register, verifyEmail, forgotPassword, resetPassword, refresh } from '../controllers/auth.controllers.js';

const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.post('/verify-email', verifyEmail);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', resetPassword);
authRoutes.post('/refresh', refresh)

export default authRoutes