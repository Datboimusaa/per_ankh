import { prisma } from "../config/prisma.js";
import { createAndSendNotification } from "../services/notification.service.js";

export async function assignMember(req, res, next) {
  try {
    const { workspaceId, taskId } = req.params;
    const { memberId } = req.body;
    const user = req.user;

    if (!memberId) {
      const error = new Error("Member ID is required to assign a user");
      error.statusCode = 400;
      throw error;
    }

    const currentUserMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!currentUserMember) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const targetMemberExists = await prisma.member.findFirst({
      where: { id: memberId, workspaceId }
    });

    if (!targetMemberExists) {
      const error = new Error("The selected user is not a member of this workspace");
      error.statusCode = 400;
      throw error;
    }

    const assignment = await prisma.taskAssignee.create({
      data: {
        taskId,
        memberId
      },
      include: {
        member: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          }
        }
      }
    });

    // Emit assignment to board room and notify assignee
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;
    const taskTitle = task?.title || task?.name || 'la tâche';
    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("member_assigned", { taskId, assignment });

    // Send notification to assigned user (background)
    const assignedUserId = assignment?.member?.user?.id;
    const assignerName = user?.name || "Quelqu'un";
    if (assignedUserId) {
      createAndSendNotification(io, {
        userId: assignedUserId,
        type: "TASK_ASSIGNED",
        message: `${assignerName} vous a assigné à la tâche: ${taskTitle}`,
        taskId: taskId,
      }).catch(err => console.error("Notification send failed:", err));
    }

    return res.status(201).json({
      success: true,
      message: "Member assigned to task successfully",
      data: assignment
    });
  } catch (error) {
    // Catch P2002 Prisma unique constraint error if user is already assigned
    if (error.code === 'P2002') {
      error.message = "User is already assigned to this task";
      error.statusCode = 400;
    }
    next(error);
  }
}

export async function unassignMember(req, res, next) {
  try {
    const { workspaceId, taskId, memberId } = req.params;
    const user = req.user;

    const currentUserMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!currentUserMember) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const assignment = await prisma.taskAssignee.findUnique({
      where: {
        taskId_memberId: { taskId, memberId }
      }
    });

    if (!assignment) {
      const error = new Error("Assignment record entry not found");
      error.statusCode = 404;
      throw error;
    }

    // Determine board to emit to
    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { column: { select: { boardId: true } } } });
    const boardId = task?.column?.boardId;

    await prisma.taskAssignee.delete({
      where: {
        taskId_memberId: { taskId, memberId }
      }
    });

    const io = req.app.get('io');
    if (io && boardId) io.to(`board:${boardId}`).emit("member_unassigned", { taskId, memberId });

    return res.status(200).json({
      success: true,
      message: "Member unassigned from task cleanly"
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskAssignees(req, res, next) {
  try {
    const { workspaceId, taskId } = req.params;
    const user = req.user;

    const currentUserMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    });

    if (!currentUserMember) {
      const error = new Error("Forbidden: Access denied");
      error.statusCode = 403;
      throw error;
    }

    const assignees = await prisma.taskAssignee.findMany({
      where: { taskId },
      include: {
        member: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } }
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: assignees
    });
  } catch (error) {
    next(error);
  }
}