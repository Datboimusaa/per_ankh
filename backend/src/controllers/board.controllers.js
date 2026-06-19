import { prisma } from "../config/prisma.js";

export async function createBoard(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const { name } = req.body;
    const user = req.user;

    if (!workspaceId || !name) {
      const error = new Error("Workspace ID and name are required");
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

    if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
      const error = new Error(
        "Forbidden: You do not have permission to create boards here",
      );
      error.statusCode = 403;
      throw error;
    }

    const board = await prisma.board.create({
      data: {
        name,
        workspaceId,
        columns: {
          createMany: {
            data: [
              { name: "To Do", position: 0 },
              { name: "In Progress", position: 1 },
              { name: "Done", position: 2 },
            ],
          },
        },
      },

      include: {
        columns: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Board created successfully with default lists",
      data: board,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBoards(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const user = req.user;

    if (!workspaceId) {
      const error = new Error("Workspace ID is required");
      error.statusCode = 400;
      throw error;
    }

    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId: workspaceId },
      },
    });

    if (!member) {
      const error = new Error(
        "Forbidden: You are not a member of this workspace",
      );
      error.statusCode = 403;
      throw error;
    }

    const boards = await prisma.board.findMany({
      where: { workspaceId: workspaceId },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
}

export async function getBoard(req, res, next) {
  try {
    const { workspaceId, boardId } = req.params;
    const user = req.user;

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        workspaceId: workspaceId,
      },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: {
            tasks: { orderBy: { position: "asc" } },
          },
        },
      },
    });

    if (!board) {
      const error = new Error("Board not found");
      error.statusCode = 404;
      throw error;
    }

    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: board.workspaceId,
        },
      },
    });

    if (!member) {
      const error = new Error(
        "Forbidden: You do not have access to this board",
      );
      error.statusCode = 403;
      throw error;
    }

    return res.status(200).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
}

export async function updateBoard(req, res, next) {
  try {
    const { workspaceId, boardId } = req.params;
    const { name } = req.body;
    const user = req.user;


    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
      const error = new Error(
        "Forbidden: You don't have permission to modify boards in this workspace",
      );
      error.statusCode = 403;
      throw error;
    }

    const existingBoard = await prisma.board.findFirst({
      where: {
        id: boardId,
        workspaceId: workspaceId,
      },
    });

    if (!existingBoard) {
      const error = new Error("Board not found in this workspace");
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (name) updates.name = name.trim();

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: updates,
    });

    return res.status(200).json({
      success: true,
      message: "Board modified successfully",
      data: updatedBoard,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBoard(req, res, next) {
  try {
    const { workspaceId, boardId } = req.params;
    const user = req.user;

    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: workspaceId,
        },
      },
    });

    if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
      const error = new Error("Forbidden: You don't have permission to delete boards in this workspace");
      error.statusCode = 403;
      throw error;
    }

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        workspaceId: workspaceId
      }
    });

    if (!board) {
      const error = new Error("Board not found in this workspace");
      error.statusCode = 404;
      throw error;
    }


    await prisma.board.delete({
      where: { id: boardId },
    });

    return res.status(200).json({
      success: true,
      message: "Board and all its associated cards were successfully deleted",
    });

  } catch (error) {
    next(error);
  }
}
