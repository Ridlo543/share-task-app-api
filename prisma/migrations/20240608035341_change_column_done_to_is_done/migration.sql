/*
  Warnings:

  - You are about to drop the column `done` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "done",
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false;
