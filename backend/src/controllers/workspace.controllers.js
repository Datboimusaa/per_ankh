import { prisma } from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

export async function createWorkspace(req, res, next) {
  try {
    const { name } = req.body;
    const user = req.user;

    if (!name) {
      if (req.file && req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename).catch(() => null);
      }
      const error = new Error("Name is required");
      error.statusCode = 400;
      throw error;
    }

    const imageURL = req.file ? req.file.path : null;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        avatar: imageURL,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => null);
    }
    next(error);
  }
}

export async function getWorkspaces(req, res, next) {
  try {
    const user = req.user;
    const memberships = await prisma.member.findMany({
      where: { userId: user.id },
      include: {
        workspace: {
          include: {
            boards: true,
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { workspace: { createdAt: "desc" } },
    });

    const workspaces = memberships.map((membership) => ({
      ...membership.workspace,
      role: membership.role,
    }));

    return res.status(200).json({ success: true, data: workspaces });
  } catch (error) {
    next(error);
  }
}

export async function getWorkspace(req, res, next) {
  try {
    const { id } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, username: true, avatar: true },
            },
          },
        },
        boards: true,
      },
    });

    if (!workspace) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
}

export async function updateWorkspace(req, res, next) {
  try {
    const { id } = req.params;
    const changes = {};

    const existingWorkspace = await prisma.workspace.findUnique({
      where: { id },
    });

    if (!existingWorkspace) {
      if (req.file && req.file.filename) {
        await cloudinary.uploader.destroy(req.file.filename).catch(() => null);
      }
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.body.name) {
      changes.name = req.body.name;
    }

    if (req.file) {
      changes.avatar = req.file.path;
    }

    const workspace = await prisma.workspace.update({
      where: { id },
      data: changes,
    });

    if (req.file && existingWorkspace.avatar) {
      const urlParts = existingWorkspace.avatar.split("/");
      const fileWithExtension = urlParts[urlParts.length - 1];
      const publicIdWithoutExtension = fileWithExtension.split(".")[0];
      const fullOldPublicId = `Per_ankh/${publicIdWithoutExtension}`;

      await cloudinary.uploader.destroy(fullOldPublicId).catch(() => null);
    }

    return res.status(200).json({
      success: true,
      message: "Workspace modified successfully",
      data: workspace,
    });
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => null);
    }
    next(error);
  }
}

export async function deleteWorkspace(req, res, next) {
  try {
    const { id } = req.params;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      const error = new Error("Workspace not found");
      error.statusCode = 404;
      throw error;
    }

    await prisma.workspace.delete({
      where: { id },
    });

    if (workspace.avatar) {
      const urlParts = workspace.avatar.split("/");
      const fileWithExtension = urlParts[urlParts.length - 1]; 
      const filenameWithoutExtension = fileWithExtension.split(".")[0];
      const publicID = `Per_ankh/${filenameWithoutExtension}`;

      await cloudinary.uploader.destroy(publicID).catch(() => null);
    }

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
