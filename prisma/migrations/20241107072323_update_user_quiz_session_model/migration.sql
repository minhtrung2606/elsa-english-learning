/*
  Warnings:

  - You are about to drop the column `data` on the `user_quiz_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_quiz_sessions" DROP COLUMN "data",
ADD COLUMN     "answer" JSONB NOT NULL DEFAULT '{}';
