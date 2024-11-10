/*
  Warnings:

  - A unique constraint covering the columns `[quiz_session_id,question_id]` on the table `quiz_session_questions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[question_id,quiz_session_id]` on the table `user_quiz_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "quiz_session_questions_quiz_session_id_question_id_key" ON "quiz_session_questions"("quiz_session_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_sessions_question_id_quiz_session_id_key" ON "user_quiz_sessions"("question_id", "quiz_session_id");
