import { prisma } from "../config/prisma.js"
import { extractPublicId } from "../utils/extractPublicId.js";

export async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}


export async function updateMe(req, res, next) {
  try {
    const userId = req.user.id;
    const changes = {};

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (req.body.name) {
      changes.name = req.body.name;
    }

    if (req.body.username) {

      const taken = await prisma.user.findUnique({
        where: { username: req.body.username },
      });

      if (taken && taken.id !== userId) {
        if (req.file && req.file.filename) {
          await cloudinary.uploader.destroy(req.file.filename).catch(() => null);
        }
        const error = new Error("Username is already taken");
        error.statusCode = 409;
        throw error;
      }

      changes.username = req.body.username;
    }

    if (req.file) {
      changes.avatar = req.file.path;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: changes,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    
    if (req.file && existingUser.avatar) {
      await cloudinary.uploader
        .destroy(extractPublicId(existingUser.avatar))
        .catch(() => null);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(() => null);
    }
    next(error);
  }
}