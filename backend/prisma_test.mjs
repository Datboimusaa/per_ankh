import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();

(async () => {
  try {
    const user = await prisma.user.findFirst({ where: { isVerified: true }, select: { id: true, email: true, username: true, name: true } });
    console.log('USER', user);
    const workspace = await prisma.workspace.findFirst({ select: { id: true, name: true, ownerId: true } });
    console.log('WORKSPACE', workspace);
    const board = await prisma.board.findFirst({ select: { id: true, name: true, workspaceId: true } });
    console.log('BOARD', board);
    const column = await prisma.column.findFirst({ select: { id: true, name: true, boardId: true } });
    console.log('COLUMN', column);
    const task = await prisma.task.findFirst({ select: { id: true, title: true, columnId: true } });
    console.log('TASK', task);
    const member = await prisma.member.findFirst({ select: { id: true, userId: true, workspaceId: true, role: true } });
    console.log('MEMBER', member);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
