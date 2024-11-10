'use client';

import { Question, UserAnswerData } from '@/repositories/quiz_session';
import React from 'react';
import SingleOptionQuestion from './single-option-question';
import AnsweredQuestion from './answered-question';
import { useRouter } from 'next/navigation';

interface QuestionFormProps {
  quizSessionId: string;
  questions: Question[];
};

type FailedOperationResp = {
  status: string;
  errors: string[];
};

const QuestionForm = ({ quizSessionId, questions }: QuestionFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [answerSheet, setAnswerSheet] = React.useState<UserAnswerData>({})

  const submitAnswer = React.useCallback(
    async () => {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/v1/quiz-sessions/test/submit-answer", {
        method: 'POST',
        body: JSON.stringify({
          sessionId: quizSessionId,
          answerSheet,
        }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const failedResp = await res.json() as FailedOperationResp;
          setError(failedResp.errors?.join('. '));
        } else {
          setError('Internal Server Error: Cannot submit your answer');
        }
        setLoading(false);
        return;
      }

      const resp = await res.json();
      if (resp?.opStatus === "success") {
        router.refresh();
      }
    },
    [answerSheet, quizSessionId, router],
  );

  const onChange = React.useCallback(
    (questionId: string, value: string) => {
      setAnswerSheet((prevAnswerSheet) => ({
        ...prevAnswerSheet,
        [`${questionId}`]: [value],
      }));
    },
    [],
  );

  const btnBgAndTextColors = React.useMemo(
    () => {
      if (loading) return 'bg-sky-900/55 text-white/55';
      return 'bg-sky-900 text-white';
    },
    [loading],
  );

  return (
    <div className="question-form flex flex-col items-center" id={`question-form-${quizSessionId}`}>
      <div className="mb-16" />
      {error && (
        <div className="text-sm mb-8 w-2/3 bg-red-100 text-red-500 border-red-500 px-12 py-4 rounded-lg border-l-8">
          {error}
        </div>
      )}
      {questions.map((question, index) => (
        <div
          key={question.id}
          className={`border-gray-300 mb-8 border-l-8 rounded-lg px-12 py-8 w-2/3 shadow-xl`}
        >
          <div className="text-xs text-gray-400 mb-2">Question {index + 1}</div>
          {question.answered ? (
            <AnsweredQuestion
              content={question.content}
              answeredValue={question.answeredValue}
            />
          ) : (
            <SingleOptionQuestion
              id={question.id}
              content={question.content}
              options={question.options}
              onChange={onChange}
            />
          )}
        </div>
      ))}
      <button
        disabled={loading}
        onClick={submitAnswer}
        className={`rounded-full border px-8 py-3 ${btnBgAndTextColors}`}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default QuestionForm;
