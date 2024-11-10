import { UserAnswerData } from '@/repositories/quiz_session';
import { getAnswerChecker } from './checker';
import { findUserByUsername } from '@/repositories/user';
import { submitAnswer } from '@/repositories/user_quiz_session';

export const checkAnswerSheet = (
  questions: {
    id: string;
    category: string,
    answered: boolean;
    score: number;
    correctAnswers: string[] | null;
  }[],
  answerSheet: UserAnswerData,
) => {
  let score = 0;
  const validAnswerSheet: UserAnswerData = {};
  questions.forEach((question) => {
    if (question.answered) return; // Ignore already answered question

    const answerArr = answerSheet[`${question.id}`];
    if (!answerArr) return; // Ignore invalid answered question

    validAnswerSheet[`${question.id}`] = answerArr;
    const checker = getAnswerChecker(question.category);
    if (!checker) return; // Unsupported answer checker

    const answeredCorrectly = checker.check(question.correctAnswers!, answerArr);
    if (answeredCorrectly) {
      score += question.score;
    }
  });
  return { validAnswerSheet, score };
}

export const submitAnswerSheet = async (
  name: string,
  sessionId: string,
  validAnswerSheet: UserAnswerData,
  score: number,
) => {
  const user = await findUserByUsername(name);
  const participant = await submitAnswer(`${user!.id}`, sessionId, validAnswerSheet, score);
  return {
    ...participant,
    id: Number(participant.id),
    userId: Number(participant.userId),
    sessionId: Number(participant.sessionId),
  };
};
