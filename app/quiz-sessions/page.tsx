import { getQuizSessions } from '@/repositories/quiz_session';
import NavLink from '../components/nav-link';

const QuizSessionsPage = async () => {
  const quizSessionArr = await getQuizSessions();
  return (
    <div id="quiz-sessions-page">
      <div className="mb-4" />
      <div className="text-3xl pb-2 text-sky-900 mb-4">Quiz Sessions</div>
      <div className="flex">
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">#</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Quiz Session Name</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Questions</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Participants</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Total Score</div>
      </div>
      {quizSessionArr.map((quizSession, index) => (
        <div className="flex" key={quizSession.id}>
          <div className="flex-1 p-2 text-sm text-gray-700">{index + 1}</div>
          <div className="flex-1 p-2">
            <NavLink
              href={`/quiz-sessions/${quizSession.id}`}
              title={quizSession.name}
            />
          </div>
          <div className="flex-1 p-2 text-sm text-gray-700">
            {quizSession._count.questions}
          </div>
          <div className="flex-1 p-2 text-sm text-gray-700">
            {quizSession._count.participants}
          </div>
          <div className="flex-1 p-2 text-sm text-gray-700">
            {
              quizSession
                .questions
                .map(q => q.score)
                .reduce((totalScore, score) => (totalScore + score), 0)
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizSessionsPage;
