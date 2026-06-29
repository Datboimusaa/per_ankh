/*
  Warnings:

  - You are about to drop the column `userId` on the `TaskAssignee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId,memberId]` on the table `TaskAssignee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `TaskAssignee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TaskAssignee" DROP CONSTRAINT "TaskAssignee_userId_fkey";

-- DropIndex
DROP INDEX "TaskAssignee_taskId_userId_key";

-- AlterTable
ALTER TABLE "TaskAssignee" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignee_taskId_memberId_key" ON "TaskAssignee"("taskId", "memberId");

-- AddForeignKey
ALTER TABLE "TaskAssignee" ADD CONSTRAINT "TaskAssignee_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
