import { prisma } from "../config/prisma.js";

export async function addMember(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;
    const user = req.user;

    if (!email || !role) {
      const error = new Error("Email and role are required");
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


    const requestingMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!requestingMember || !["OWNER", "ADMIN"].includes(requestingMember.role)) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const existingMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: userToAdd.id, workspaceId } },
    });

    if (existingMember) {
      const error = new Error("User is already a member of this workspace");
      error.statusCode = 409;
      throw error;
    }

    if (requestingMember.role === "ADMIN" && role === "OWNER") {
      const error = new Error("Admins cannot assign the OWNER role");
      error.statusCode = 403;
      throw error;
    }

    const member = await prisma.member.create({
      data: {
        userId: userToAdd.id,
        workspaceId,
        role: role || "MEMBER",
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });

    return res.status(201).json({ success: true, message: "Member added successfully", data: member });
  } catch (error) {
    next(error);
  }
}

export async function updateMemberRole(req, res, next) {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;
    const user = req.user;

    if (!role) {
      const error = new Error("Role is required");
      error.statusCode = 400;
      throw error;
    }

    const requestingMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    if (!requestingMember || requestingMember.role !== "OWNER") {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const memberToUpdate = await prisma.member.findFirst({
      where: { id: memberId, workspaceId },
    });

    if (!memberToUpdate) {
      const error = new Error("Member not found in this workspace");
      error.statusCode = 404;
      throw error;
    }

    if (memberToUpdate.userId === user.id) {
      const error = new Error("You cannot change your own role");
      error.statusCode = 400;
      throw error;
    }

    const member = await prisma.member.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return res.status(200).json({ success: true, message: "Member role updated successfully", data: member });
  } catch (error) {
    next(error);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { workspaceId, memberId } = req.params;
    const user = req.user;

    if (!workspaceId || !memberId) {
      const error = new Error("Workspace ID and member ID are required");
      error.statusCode = 400;
      throw error;
    }

    const memberToRemove = await prisma.member.findFirst({
      where: { id: memberId, workspaceId },
    });

    if (!memberToRemove) {
      const error = new Error("Member not found in this workspace");
      error.statusCode = 404;
      throw error;
    }

    const requestingMember = await prisma.member.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } },
    });

    const isSelf = memberToRemove.userId === user.id;
    const isPrivileged = requestingMember && ["OWNER", "ADMIN"].includes(requestingMember.role);

    if (!isSelf && !isPrivileged) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    if (isSelf && memberToRemove.role === "OWNER") {
      const error = new Error("Owner cannot leave the workspace. Delete it or transfer ownership first.");
      error.statusCode = 400;
      throw error;
    }

    if (requestingMember?.role === "ADMIN" && memberToRemove.role === "OWNER") {
      const error = new Error("Admins cannot remove the owner");
      error.statusCode = 403;
      throw error;
    }

    await prisma.member.delete({
      where: { id: memberId },
    });

    return res.status(200).json({
      success: true,
      message: isSelf ? "You left the workspace" : "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
}
