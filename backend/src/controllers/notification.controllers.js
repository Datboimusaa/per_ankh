import { prisma } from '../config/prisma.js';

export async function getNotifications(req, res, next) {
  try {
    const user = req.user;

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { notificationId } = req.params;
    const user = req.user;

    await prisma.notification.updateMany({
      where: { 
        id: notificationId,
        userId: user.id // Security check
      },
      data: { read: true } // Updated to match your schema
    });

    return res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const user = req.user;

    await prisma.notification.updateMany({
      where: { userId: user.id, read: false }, // Updated to match your schema
      data: { read: true } // Updated to match your schema
    });

    return res.status(200).json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    next(error);
  }
}