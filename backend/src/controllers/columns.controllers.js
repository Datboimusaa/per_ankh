import { prisma } from "../config/prisma.js"

export async function createColumn(req, res, next) {
  try {
    const { workspaceId, boardId } = req.params;
    const { name } = req.body;
    const user = req.user;

    if (!workspaceId || !boardId || !name) {
      const error = new Error("Workspace ID, Board ID, and Column name are required");
      error.statusCode = 400;
      throw error;
    }


    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        workspaceId: workspaceId, 
      },
      include: {
        workspace: {
          include: {
            members: {
              where: {
                userId: user.id,
                role: { in: ["OWNER", "ADMIN"] },
              },
            },
          },
        },
      },
    });


    if (!board || board.workspace.members.length === 0) {
      const error = new Error("Forbidden: You don't have access or administrative rights in this workspace");
      error.statusCode = 403;
      throw error;
    }

    const columnCount = await prisma.column.count({
      where: { boardId },
    });


    const column = await prisma.column.create({
      data: {
        name: name.trim(),
        boardId,
        position: columnCount, 
      },
    });

    return res.status(201).json({
      success: true,
      message: "Column created successfully",
      data: column,
    });

  } catch (error) {
    next(error);
  }
}


export async function updateColumn(req, res, next) {
  try {
    const { workspaceId, boardId, columnId } = req.params;
    const { name, position } = req.body;
    const user = req.user;

    // 1. Validate permissions in a single database lookup
    const board = await prisma.board.findFirst({
      where: { id: boardId, workspaceId },
      include: {
        workspace: {
          include: {
            members: {
              where: {
                userId: user.id,
                role: { in: ["OWNER", "ADMIN"] },
              },
            },
          },
        },
      },
    });

    if (!board || board.workspace.members.length === 0) {
      const error = new Error("Forbidden: You don't have permission to modify columns here");
      error.statusCode = 403;
      throw error;
    }

    // 2. Enforce column integrity
    const existingColumn = await prisma.column.findFirst({
      where: { id: columnId, boardId },
    });

    if (!existingColumn) {
      const error = new Error("Column not found on this board");
      error.statusCode = 404;
      throw error;
    }

    // 3. Build dynamic updates
    const updates = {};
    if (name) updates.name = name.trim();
    if (typeof position === "number") updates.position = position;

    // 4. Mutate
    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: updates,
    });

    return res.status(200).json({
      success: true,
      message: "Column updated successfully",
      data: updatedColumn,
    });

  } catch (error) {
    next(error);
  }
}


export async function deleteColumn(req, res, next) {
  try {
    const { workspaceId, boardId, columnId } = req.params;
    const user = req.user;

    // 1. Permission validation
    const board = await prisma.board.findFirst({
      where: { id: boardId, workspaceId },
      include: {
        workspace: {
          include: {
            members: {
              where: {
                userId: user.id,
                role: { in: ["OWNER", "ADMIN"] },
              },
            },
          },
        },
      },
    });

    if (!board || board.workspace.members.length === 0) {
      const error = new Error("Forbidden: You don't have permission to delete columns");
      error.statusCode = 403;
      throw error;
    }

    // 2. Column verification
    const column = await prisma.column.findFirst({
      where: { id: columnId, boardId },
    });

    if (!column) {
      const error = new Error("Column not found on this board");
      error.statusCode = 404;
      throw error;
    }

    // 3. Destroy column (Cascades down to its tasks automatically)
    await prisma.column.delete({
      where: { id: columnId },
    });

    return res.status(200).json({
      success: true,
      message: "Column and its tasks successfully deleted",
    });

  } catch (error) {
    next(error);
  }
}