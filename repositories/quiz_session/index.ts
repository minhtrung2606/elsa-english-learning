import prisma from '@/prisma/client';
import { PaginationOption } from '../types';
import { checkAnswerSheet } from '@/services/quiz';

const GENERAL_SESSION_INFO_QUERY_OPTION = {
  select: {
    id: true,
    name: true,
    _count: {
      select: {
        participants: true,
        questions: true,
      },
    },
  },
};

const getQuizSessionForSubmissionQueryConfig = (sessionId: string, username: string) => ({
  where: { id: BigInt(sessionId) },
  select: {
    id: true,
    name: true,
    questions: {
      select: {
        question: { select: { id: true, data: true, category: true } },
        score: true,
      },
    },
    participants: {
      select: { id: true, answer: true },
      where: { user: { username: (username || "") } },
      take: 1,
    },
  },
});

export type QuestionData = {
  options: string[];
  answers: string[];
};

export type UserAnswerData = {
  [id: string]: string[];
};

export type Question = {
  id: string;
  content: string;
  category: string;
  answered: boolean;
  answeredValue: string | string[];
  options: string[];
};

export const getQuizSessions = async (paginationOption?: PaginationOption) => {
  return await prisma.quizSession.findMany({
    select: {
      id: true,
      name: true,
      questions: { select: { score: true } },
      _count: {
        select: {
          participants: true,
          questions: true,
        },
      },
    },
  })
};

export const getQuizSessionById = async (id: string) => {
  return await prisma.quizSession.findFirst({
    where: { id: BigInt(id) },
    ...GENERAL_SESSION_INFO_QUERY_OPTION,
  });
};

export const getQuizSessionForSubmission = async (
  id: string,
  username: string,
  includeCorrectAnswers?: boolean | null,
) => {
  const quizSession = await prisma.quizSession.findFirst(
    getQuizSessionForSubmissionQueryConfig(id, username!),
  );

  if (!quizSession) return null;

  const { participants, questions } = quizSession;
  const participant = participants[0];
  const answerSheet = (participant?.answer as UserAnswerData) || {};

  let answeredQuestionCount = 0;
  const testQuestionArr = questions.map((q) => {
    const question = q.question;
    const score = q.score;
    const { id, category, data } = question;
    const { answers } = data as QuestionData;
    const answeredValueArr = answerSheet[`${question.id}`] as string[];
    const answered = answeredValueArr && answeredValueArr.length > 0;

    if (answered) answeredQuestionCount += 1;

    return {
      id: `${id}`,
      category,
      answered,
      score,
      correctAnswers: includeCorrectAnswers ? answers : null,
    };
  });

  return {
    questions: testQuestionArr,
    completed: answeredQuestionCount === questions.length,
  };
};

const getQuizSessionWithQuestions = async (sessionId: string) => {
  const quizSession = await prisma.quizSession.findUnique({
    select: {
      id: true,
      name: true,
      questions: {
        select: {
          score: true,
          question: {
            select: {
              id: true,
              content: true,
              category: true,
              data: true,
            }
          },
        },
      },
    },
    where: { id: BigInt(sessionId) },
  });

  if (!quizSession) return null;

  return {
    id: `${quizSession?.id}`,
    name: quizSession.name,
    questions: quizSession.questions.map((q) => {
      const { score, question } = q;
      const { id, content, category, data } = question;
      const { options, answers } = data as QuestionData;
      return {
        id: `${id}`,
        content,
        category,
        options,
        answers,
        score,
      };
    }),
  };
};

export const getQuizSessionParticipant = async (sessionId: string, username: string) => {
  const participant = await prisma.userQuizSession.findFirst({
    where: {
      sessionId: BigInt(sessionId),
      user: { username },
    },
  });

  if (!participant) return null;
  const { userId, score, answer } = participant;

  return {
    userId,
    sessionId,
    answer: answer as ({ [id: string]: string[] }),
    score,
  };
};

export const getQuizSessionForTesting = async (
  sessionId: string,
  username: string,
) => {
  const quizSessionWithQuestions = await getQuizSessionWithQuestions(sessionId);
  const participant = await getQuizSessionParticipant(sessionId, username);

  if (!quizSessionWithQuestions) return null;
  const { name, questions } = quizSessionWithQuestions;

  let completed = true;
  let totalScore = 0;
  const questionArr = questions.map((q) => {
    const answeredValues = participant?.answer[q.id] || [];
    const answered = answeredValues.length > 0;

    completed = completed && answered;
    totalScore += q.score;

    const checkRes = checkAnswerSheet(
      [
        {
          id: q.id,
          category: q.category,
          answered: false,
          score: q.score,
          correctAnswers: q.answers,
        }
      ],
      participant?.answer || {},
    );

    return {
      ...q,
      answered,
      answeredValue: answeredValues,
      correct: checkRes.score > 0,
    };
  });

  return {
    name,
    questions: questionArr,
    completed,
    userScore: participant?.score || 0,
    totalScore,
  };
};

export const getParticipantsByQuizSessionId = async (
  sessionId: string,
  paginationOption?: PaginationOption,
) => {
  return await prisma.userQuizSession.findMany({
    select: {
      user: { select: { id: true, username: true } },
      score: true,
      participatedAt: true,
    },
    where: { sessionId: BigInt(sessionId) },
    orderBy: { score: "desc" },
  });
};
