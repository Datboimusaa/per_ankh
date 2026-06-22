import { prisma } from '../config/prisma.js'

export async function createNote(req, res, next) {
  try {
    const { workspaceId, taskId } = req.params;
    const { title, content } = req.body;
    const user = req.user;

    if (!title || !title.trim()) {
      const error = new Error("Note title is required");
      error.statusCode = 400;
      throw error;
    }

    const member = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!member) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content?.trim() || "",
        taskId
      }
    });

    // Emit addition to board channel
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("note_added", { taskId, note });

    return res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { workspaceId, taskId, noteId } = req.params;
    const { title, content } = req.body;
    const user = req.user;

    const member = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!member) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const existingNote = await prisma.note.findFirst({
      where: { id: noteId, taskId }
    });

    if (!existingNote) {
      const error = new Error("Note not found on this task");
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (title) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updates
    });

    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("note_updated", { taskId, noteId, note: updatedNote });

    return res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { workspaceId, taskId, noteId } = req.params;
    const user = req.user;

    const member = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!member) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const existingNote = await prisma.note.findFirst({
      where: { id: noteId, taskId }
    });

    if (!existingNote) {
      const error = new Error("Note not found on this task");
      error.statusCode = 404;
      throw error;
    }

    await prisma.note.delete({ where: { id: noteId } });

    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("note_deleted", { taskId, noteId });

    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
}