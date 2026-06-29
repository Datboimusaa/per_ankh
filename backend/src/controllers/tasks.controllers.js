import { prisma } from "../config/prisma.js";

export async function createTask(req, res, next) {
  try {
    const { workspaceId, boardId, columnId } = req.params;
    const { title, description } = req.body;
    const user = req.user;

    if (!title) {
      const error = new Error("Task title is required");
      error.statusCode = 400;
      throw error;
    }

    const board = await prisma.board.findFirst({
      where: { id: boardId, workspaceId },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!board || board.workspace.members.length === 0) {
      const error = new Error("Forbidden: You don't have access to this workspace");
      error.statusCode = 403;
      throw error;
    }

    const column = await prisma.column.findFirst({
      where: { id: columnId, boardId },
    });

    if (!column) {
      const error = new Error("Column not found on this board");
      error.statusCode = 404;
      throw error;
    }

    const taskCount = await prisma.task.count({
      where: { columnId },
    });

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        columnId,
        position: taskCount,
      },
    });

    // Real-time broadcast to board channel
    const io = req.app.get('io');
    if (io) io.to(`board:${boardId}`).emit("task_created", { columnId, task });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const { workspaceId, boardId, columnId, taskId } = req.params;
    const user = req.user;

    const task = await prisma.task.findFirst({
      where: { 
        id: taskId,
        columnId: columnId,
        column: {
          boardId: boardId,
          board: { workspaceId: workspaceId }
        }
      },
      include: {
        assignees: {
          include: {
            member: {
              include: {
                user: {
                  select: { id: true, name: true, avatar: true }
                }
              }
            }
          }
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { // Note: Your schema uses 'author' relation name for Comment model
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        files: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!task) {
      const error = new Error("Task not found or path context mismatch");
      error.statusCode = 404;
      throw error;
    }

    // Verify requesting user actually belongs to this workspace context
    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: { 
          userId: user.id, 
          workspaceId: workspaceId 
        }
      },
    });

    if (!member) {
      const error = new Error("Forbidden: You do not have access to this workspace");
      error.statusCode = 403;
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      data: task 
    });

  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { workspaceId, boardId, columnId, taskId } = req.params;
    // FIXED: Destructured 'title' instead of 'name'
    const { title, description, position, targetColumnId } = req.body;
    const user = req.user;

    const board = await prisma.board.findFirst({
      where: { id: boardId, workspaceId },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!board || board.workspace.members.length === 0) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, columnId },
    });

    if (!existingTask) {
      const error = new Error("Task not found in this column");
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    // FIXED: Aligned assignment to reflect schema model mapping
    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (typeof position === "number") updates.position = position;
    
    if (targetColumnId) {
      const targetColumnExists = await prisma.column.findFirst({
        where: { id: targetColumnId, boardId },
      });

      if (!targetColumnExists) {
        const error = new Error("Target column does not exist on this board");
        error.statusCode = 400;
        throw error;
      }
      updates.columnId = targetColumnId;
    }

    const sourceColumnId = existingTask.columnId;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updates,
    });

    const io = req.app.get('io');
    const moved = updates.columnId || typeof updates.position === 'number';
    if (moved) {
      if (req.socket && req.socket.to) {
        req.socket.to(`board:${boardId}`).emit("task_moved", {
          taskId,
          sourceColumnId,
          targetColumnId: updates.columnId || columnId,
          position: updates.position,
        });
      } else if (io) {
        io.to(`board:${boardId}`).emit("task_moved", {
          taskId,
          sourceColumnId,
          targetColumnId: updates.columnId || columnId,
          position: updates.position,
        });
      }
    } else {
      if (io) io.to(`board:${boardId}`).emit("task_updated", { taskId, updates: updatedTask });
    }

    return res.status(200).json({
      success: true,
      message: "Task mutated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { workspaceId, boardId, columnId, taskId } = req.params;
    const user = req.user;

    const board = await prisma.board.findFirst({
      where: { id: boardId, workspaceId },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: user.id },
            },
          },
        },
      },
    });

    if (!board || board.workspace.members.length === 0) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, columnId },
    });

    if (!task) {
      const error = new Error("Task not found inside this column context");
      error.statusCode = 404;
      throw error;
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    const io = req.app.get('io');
    if (io) io.to(`board:${boardId}`).emit("task_deleted", { columnId, taskId });

    return res.status(200).json({
      success: true,
      message: "Task item dropped and deleted completely",
    });
  } catch (error) {
    next(error);
  }
}