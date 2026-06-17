import prisma from "../config/prisma.js";

export async function createBoard(req, res, next) {
  try {
    const { workspaceId } = req.params
    const { name } = req.body;
    const user = req.user;

    if (!workspaceId || !name) {
      const error = new Error("Workspace ID and name is required");
      error.statusCode = 400;
      throw error;
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!member) {
      const error = new Error("Forbidden");
      error.statusCode = 401;
      throw error;
    }

  } catch (error) {
    next(error);
  }
}
