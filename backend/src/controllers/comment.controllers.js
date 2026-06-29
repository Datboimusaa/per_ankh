import { prisma } from "../config/prisma.js"

export async function createComment(req, res, next) {
  try {
    const { workspaceId, taskId } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!content || !content.trim()) {
      const error = new Error("Comment content cannot be empty");
      error.statusCode = 400;
      throw error;
    }


    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: { userId: user.id, workspaceId }
      },
    });

    if (!member) {
      const error = new Error("Forbidden: You are not a member of this workspace");
      error.statusCode = 403;
      throw error;
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId,
        userId: user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Locate board for real-time channel
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("comment_added", { taskId, comment });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(req, res, next) {
  try {
    const { taskId, commentId } = req.params;
    const { content } = req.body;
    const user = req.user;

    if (!content || !content.trim()) {
      const error = new Error("Comment content cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    const existingComment = await prisma.comment.findFirst({
      where: { id: commentId, taskId }
    });

    if (!existingComment) {
      const error = new Error("Comment not found on this task");
      error.statusCode = 404;
      throw error;
    }

    if (existingComment.userId !== user.id) {
      const error = new Error("Forbidden: You can only edit your own comments");
      error.statusCode = 403;
      throw error;
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Emit update to board channel
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("comment_updated", { taskId, commentId, content: updatedComment.content });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { workspaceId, taskId, commentId } = req.params;
    const user = req.user;

    const [existingComment, member] = await prisma.$transaction([
      prisma.comment.findFirst({ where: { id: commentId, taskId } }),
      prisma.member.findUnique({ where: { userId_workspaceId: { userId: user.id, workspaceId } } })
    ]);

    if (!existingComment) {
      const error = new Error("Comment not found on this task");
      error.statusCode = 404;
      throw error;
    }

    const isAuthor = existingComment.userId === user.id;
    const isPrivileged = member && ["OWNER", "ADMIN"].includes(member.role);

    if (!isAuthor && !isPrivileged) {
      const error = new Error("Forbidden: You do not have permission to delete this comment");
      error.statusCode = 403;
      throw error;
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    // Emit deletion to board channel
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("comment_deleted", { taskId, commentId });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}