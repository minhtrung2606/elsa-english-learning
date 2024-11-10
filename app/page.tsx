import Link from "next/link";

export default function Home() {
  return (
    <div
      id="quiz-sessions-page"
      className="bg-white p-4 min-h-screen flex flex-col items-center justify-center"
    >
      <div className="text-4xl text-sky-900 mb-4">
        Welcome to English Learning
      </div>
      <Link href="/quiz-sessions" className="text-sm text-sky-700">
        Quiz Sessions
      </Link>
    </div>
  )
};
