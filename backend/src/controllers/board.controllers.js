import prisma from "../config/prisma.js"

export async function createBoard(req, res, next) {
    try {
        const {workspaceId, name} = req.body;
        const user = req.user;

        if(!workspaceId || !name) {
            const error = new Error('Workspace ID and name is required');
            error.statusCode = 400;
            throw error
        }


    } catch (error) {
        next(error)
    }
}