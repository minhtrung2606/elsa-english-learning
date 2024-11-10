import { authOptions } from '@/app/api/auth/[...nextauth]/constants';
import NavLink from '@/app/components/nav-link';
import { getParticipantsByQuizSessionId, getQuizSessionById, getQuizSessionParticipant } from '@/repositories/quiz_session';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

interface QuizSessionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const QuizSessionDetailPage = async ({ params }: QuizSessionDetailPageProps) => {
  const { id } = await params;
  const quizSession = await getQuizSessionById(id);
  const loginSession = await getServerSession(authOptions);

  if (!quizSession) {
    redirect('/quiz-sessions');
  }

  const rankedParticipantArr = await getParticipantsByQuizSessionId(id);
  const participant = await getQuizSessionParticipant(id, loginSession?.user?.name || "");

  return (
    <div id={`quiz-session-${id}-leaderboard-page`}>
      <div className="flex flex-row items-start justify-between">
        <NavLink
          href="/quiz-sessions"
          title="< Back to quiz sessions"
        />
        {loginSession?.user && !participant && (
          <NavLink
            href={`/quiz-sessions/${id}/test`}
            title="Start testing"
          />
        )}
      </div>
      <div className="text-3xl pb-2 text-sky-900">Quiz Session: {quizSession.name}</div>
      {!loginSession?.user && (
        <div className="text-sm mb-8 bg-sky-100 text-sky-500 border-sky-500 px-12 py-4 rounded-lg border-l-8">
          Login to start testing
        </div>
      )}
      <div className="mb-4 mt-8">
        <div className="text-xl">Participants</div>
      </div>
      <div className="flex">
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Rank</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Username</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Particpated At</div>
        <div className="flex-1 p-2 bg-gray-50 text-xs text-gray-400">Score</div>
      </div>
      {rankedParticipantArr.map((rankedParticipant, index) => (
        <div className="flex" key={rankedParticipant.user.id}>
          <div className="flex-1 p-2 text-sm text-gray-700">{index + 1}</div>
          <div className="flex-1 p-2 text-sm text-gray-700">
            {participant?.userId === rankedParticipant.user.id && (
              <NavLink
                href={`/quiz-sessions/${id}/test`}
                title={`${rankedParticipant.user.username} (You)`}
              />
            )}
            {participant?.userId !== rankedParticipant.user.id && (
              <span>{rankedParticipant.user.username}</span>
            )}
          </div>
          <div className="flex-1 p-2 text-sm text-gray-700">{rankedParticipant.participatedAt.toLocaleDateString()}</div>
          <div className="flex-1 p-2 text-sm text-gray-700">{rankedParticipant.score}</div>
        </div>
      ))}
    </div>
  );
};

export default QuizSessionDetailPage;
