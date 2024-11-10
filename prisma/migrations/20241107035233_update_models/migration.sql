/*
  Warnings:

  - You are about to drop the column `question_id` on the `answer_sheets` table. All the data in the column will be lost.
  - You are about to drop the column `quiz_question_session_id` on the `answer_sheets` table. All the data in the column will be lost.
  - Added the required column `user_quiz_session` to the `answer_sheets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answer_sheets" DROP CONSTRAINT "answer_sheets_question_id_fkey";

-- DropForeignKey
ALTER TABLE "answer_sheets" DROP CONSTRAINT "answer_sheets_quiz_question_session_id_fkey";

-- AlterTable
ALTER TABLE "answer_sheets" DROP COLUMN "question_id",
DROP COLUMN "quiz_question_session_id",
ADD COLUMN     "user_quiz_session" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "user_quiz_sessions" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "question_id" BIGINT NOT NULL,
    "quiz_session_id" BIGINT NOT NULL,

    CONSTRAINT "user_quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_quiz_sessions" ADD CONSTRAINT "user_quiz_sessions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_sessions" ADD CONSTRAINT "user_quiz_sessions_quiz_session_id_fkey" FOREIGN KEY ("quiz_session_id") REFERENCES "quiz_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_sheets" ADD CONSTRAINT "answer_sheets_user_quiz_session_fkey" FOREIGN KEY ("user_quiz_session") REFERENCES "user_quiz_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
