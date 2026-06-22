import { prisma } from "../config/prisma.js"
import cloudinary from "../config/cloudinary.js";
import { extractPublicId } from "../utils/extractPublicId.js";


export async function attachFile(req, res, next) {
  try {
    const { workspaceId, taskId } = req.params;
    const user = req.user;

    if (!req.file) {
      const error = new Error("No file uploaded or file type rejected");
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


    const fileRecord = await prisma.file.create({
      data: {
        name: req.file.originalname, 
        url: req.file.path,          
        taskId
      }
    });

    // Emit file attached to board channel
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("file_attached", { taskId, fileRecord });

    return res.status(201).json({
      success: true,
      message: "File attached successfully",
      data: fileRecord
    });
  } catch (error) {
    next(error);
  }
}




export async function deleteFile(req, res, next) {
  try {
    const { workspaceId, taskId, fileId } = req.params;
    const user = req.user;

    const member = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!member) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const fileRecord = await prisma.file.findFirst({
      where: { id: fileId, taskId }
    });

    if (!fileRecord) {
      const error = new Error("File record not found on this task");
      error.statusCode = 404;
      throw error;
    }

    const publicId = extractPublicId(fileRecord.url);
    
    await cloudinary.v2.uploader.destroy(publicId);

    // Emit file deleted event to board
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;

    await prisma.file.delete({
      where: { id: fileId }
    });

    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("file_deleted", { taskId, fileId });

    return res.status(200).json({
      success: true,
      message: "File asset cleared from cloud and tracking databases successfully"
    });
  } catch (error) {
    next(error);
  }
}