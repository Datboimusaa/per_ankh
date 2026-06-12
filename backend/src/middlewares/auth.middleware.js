import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import prisma from '../config/prisma.js';

export default async function authMiddleware(req, res, next) {
    try {
        const token  = req.cookies.accessToken;

        if(!token) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            throw error
        }

        const decoded = await jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                avatar: true
            }
        });

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        req.user = user;

        next();

    } catch (error) {
        next(error)
    }
}