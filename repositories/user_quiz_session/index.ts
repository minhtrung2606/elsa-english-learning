import prisma from '@/prisma/client';
import { UserAnswerData } from '../quiz_session';

export const submitAnswer = async (
  userId: string,
  sessionId: string,
  answer: UserAnswerData,
  score: number,
) => {
  const participant = await prisma.userQuizSession.create({
    data: {
      userId: BigInt(userId),
      sessionId: BigInt(sessionId),
      answer,
      score,
    },
  });
  return participant;
};
