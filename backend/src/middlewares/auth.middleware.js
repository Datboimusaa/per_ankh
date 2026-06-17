import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export default async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.accessToken; // Optional chaining safe-check

        if (!token) {
            const error = new Error('Unauthorized: No token provided');
            error.statusCode = 401;
            throw error;
        }

        // 1. FIXED: Removed 'await' since jwt.verify is synchronous
        const decoded = jwt.verify(token, JWT_SECRET);

        // 2. FIXED: Fallback handle for both "id" and "userId" variations
        const userId = decoded.id || decoded.userId;

        if (!userId) {
            const error = new Error('Unauthorized: Invalid token structure');
            error.statusCode = 401;
            throw error;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatar: true
            }
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        req.user = user;
        next();

    } catch (error) {
        // Force status code to 401 if it's a JWT signature expiration error
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.statusCode = 401;
        }
        next(error);
    }
}
