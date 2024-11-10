/*
  Warnings:

  - You are about to drop the column `question_id` on the `user_quiz_sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,quiz_session_id]` on the table `user_quiz_sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `user_quiz_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_quiz_sessions" DROP CONSTRAINT "user_quiz_sessions_question_id_fkey";

-- DropIndex
DROP INDEX "user_quiz_sessions_question_id_quiz_session_id_key";

-- AlterTable
ALTER TABLE "user_quiz_sessions" DROP COLUMN "question_id",
ADD COLUMN     "user_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_sessions_user_id_quiz_session_id_key" ON "user_quiz_sessions"("user_id", "quiz_session_id");

-- AddForeignKey
ALTER TABLE "user_quiz_sessions" ADD CONSTRAINT "user_quiz_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
