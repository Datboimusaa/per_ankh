import { prisma } from '../config/prisma.js'; 
import { sendEmail } from './email.service.js'; 

export async function createAndSendNotification(io, { userId, type, message, taskId = null, noteId = null }) {
  try {

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        read: false,
        taskId,
        noteId
      }
    });


    io.to(`user:${userId}`).emit("new_notification", notification);


    const targetUser = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (targetUser?.email) {

      const subject = type.replace(/_/g, ' ').toLowerCase();
      const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);

      const emailHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">${capitalizedSubject}</h2>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">Bonjour ${targetUser.name || ''},</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <small style="color: #64748b;">Cette notification provient de votre espace de travail collaboratif Per Ankh.</small>
        </div>
      `;

      sendEmail({
        to: targetUser.email,
        subject: `Per Ankh - ${capitalizedSubject}`,
        html: emailHtml
      }).catch(err => console.error("Brevo delivery fail:", err));
    }

    return notification;
  } catch (error) {
    console.error("Notification system error:", error);
  }
}