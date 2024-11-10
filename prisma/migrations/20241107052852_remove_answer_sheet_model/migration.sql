/*
  Warnings:

  - You are about to drop the column `created_at` on the `user_quiz_sessions` table. All the data in the column will be lost.
  - You are about to drop the `answer_sheets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "answer_sheets" DROP CONSTRAINT "answer_sheets_user_quiz_session_fkey";

-- AlterTable
ALTER TABLE "user_quiz_sessions" DROP COLUMN "created_at",
ADD COLUMN     "data" JSONB NOT NULL DEFAULT '{"answers":[]}',
ADD COLUMN     "participated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "answer_sheets";
