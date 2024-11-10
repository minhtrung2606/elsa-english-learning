-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" BIGSERIAL NOT NULL,
    "content" VARCHAR NOT NULL,
    "category" VARCHAR(25) NOT NULL DEFAULT 'single',
    "data" JSONB NOT NULL DEFAULT '{"options": [],"answers":[]}',
    "status" VARCHAR(25) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_session_questions" (
    "id" BIGSERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "quiz_session_id" BIGINT NOT NULL,
    "question_id" BIGINT NOT NULL,

    CONSTRAINT "quiz_session_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_sheets" (
    "id" BIGSERIAL NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{"answers":[]}',
    "score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "question_id" BIGINT NOT NULL,
    "quiz_question_session_id" BIGINT NOT NULL,

    CONSTRAINT "answer_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "quiz_session_questions" ADD CONSTRAINT "quiz_session_questions_quiz_session_id_fkey" FOREIGN KEY ("quiz_session_id") REFERENCES "quiz_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_session_questions" ADD CONSTRAINT "quiz_session_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_sheets" ADD CONSTRAINT "answer_sheets_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_sheets" ADD CONSTRAINT "answer_sheets_quiz_question_session_id_fkey" FOREIGN KEY ("quiz_question_session_id") REFERENCES "quiz_session_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
