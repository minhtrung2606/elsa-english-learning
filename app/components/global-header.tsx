import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '../api/auth/[...nextauth]/constants';

interface GlobalHeaderProps {}

const GlobalHeader = async ({}: GlobalHeaderProps) => {
  const loginSession = await getServerSession(authOptions);

  return (
    <div className="container mx-auto bg-sky-900 text-white p-4 py-2 flex flex-row items-center justify-between">
      <div className="text-sm">
        <Link href="/">English Learning</Link>
      </div>
      {loginSession?.user && (
        <div className="text-sm">
          <span className="mr-4">@{loginSession.user.name}</span>
          <Link href="/api/auth/signout?callbackUrl=/quiz-sessions">Logout</Link>
        </div>
      )}
      {!loginSession?.user && (
        <div className="text-sm">
          <Link href="/api/auth/signin?callbackUrl=/quiz-sessions">Login</Link>
        </div>
      )}
    </div>
  );
};

export default GlobalHeader;
