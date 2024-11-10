import { getQuizSessionForSubmission, UserAnswerData } from '@/repositories/quiz_session';
import { checkAnswerSheet, submitAnswerSheet } from '@/services/quiz';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

interface QuizSessionTestSubmitAnswerPayload {
  sessionId: string;
  answerSheet: UserAnswerData;
}

export async function POST(req: NextRequest) {
  const { sessionId, answerSheet }: QuizSessionTestSubmitAnswerPayload = await req.json();
  if (!sessionId || !answerSheet || Object.keys(answerSheet).length === 0) {
    return NextResponse.json(
      {
        opStatus: "failed",
        errors: ["Question submission requires valid answer sheet"],
      },
      { status: 400 },
    );
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { name } = token!;
  const quizSessionWithQuestions = await getQuizSessionForSubmission(sessionId, name!, true);
  if (!quizSessionWithQuestions) {
    return NextResponse.json(
      { opStatus: "failed", errors: ["Quiz session not found"] },
      { status: 400 },
    );
  }

  const { completed, questions } = quizSessionWithQuestions;

  if (completed) {
    return NextResponse.json(
      { opStatus: "failed", errors: ["Quiz session already completed"] },
      { status: 400 },
    );
  }

  const { validAnswerSheet, score } = checkAnswerSheet(questions, answerSheet);
  if (Object.keys(validAnswerSheet).length < questions.length) {
    return NextResponse.json(
      {
        opStatus: "failed",
        errors: ["Question submission requires valid answer sheet"],
      },
      { status: 400 },
    );
  }

  const participant = await submitAnswerSheet(name!, sessionId, validAnswerSheet, score);
  return NextResponse.json({ opStatus: "success", data: participant });
}
