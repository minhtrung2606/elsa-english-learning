import { getQuizSessionForTesting } from '@/repositories/quiz_session';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import QuestionForm from './components/question-form';
import AnsweredQuestion from './components/answered-question';
import { authOptions } from '@/app/api/auth/[...nextauth]/constants';
import NavLink from '@/app/components/nav-link';

interface QuizSessionTestPageProps {
  params: Promise<{
    id: string;
  }>;
}

const QuizSessionTestPage = async ({ params }: QuizSessionTestPageProps) => {
  const { id } = await params;
  const loginSession = await getServerSession(authOptions);

  const quizSession = await getQuizSessionForTesting(id, loginSession?.user?.name || "");
  if (!quizSession) {
    redirect('/quiz-sessions');
  }

  const { name, completed, questions, totalScore, userScore } = quizSession;

  if (completed) {
    return (
      <div id={`quiz-session-${id}-test-page`}>
        <div className="flex flex-row items-start justify-between">
          <NavLink
            href={`/quiz-sessions/${id}`}
            title="< Back"
          />
        </div>
        <div className="text-3xl pb-2 text-sky-900">Quiz Session: {name}</div>
        <div className="text-xs">
          <span className="mr-1 text-gray-400">Status:</span>
          <strong className="text-green-700">Completed</strong>
        </div>
        <div className="text-xs">
          <span className="mr-1 text-gray-400">Your score:</span>
          <span>{userScore}</span>
          <span>/</span>
          <span>{totalScore}</span>
        </div>
        <div className="mb-16" />
        <div className="flex flex-col items-center">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`${question.correct ? 'border-green-700 ' : 'border-red-700'} mb-8 border-l-8 rounded-lg px-12 py-8 w-2/3 shadow-xl`}
            >
              <div className="text-xs text-gray-400 mb-2">Question {index + 1}</div>
              <AnsweredQuestion
                content={question.content}
                answeredValue={question.answeredValue}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id={`quiz-session-${id}-test-page`}>
      <div className="flex flex-row items-start justify-between">
        <NavLink
          href={`/quiz-sessions/${id}`}
          title="< Back"
        />
      </div>
      <div className="text-3xl pb-2 text-sky-900">Quiz Session: {name}</div>
      {!loginSession?.user && (
        <div className="text-center my-4 bg-orange-100 text-orange-500 p-4">
          <div>You need to login to participate in the quiz</div>
        </div>
      )}
      {loginSession?.user && (
        <QuestionForm
          quizSessionId={id}
          questions={questions}
        />
      )}
    </div>
  );
};

export default QuizSessionTestPage;
