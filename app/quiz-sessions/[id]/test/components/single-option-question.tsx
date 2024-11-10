'use client';

import React from 'react';

interface SingleOptionQuestionProps {
  id: string;
  content: string;
  options: string[];
  onChange: (questionId: string, value: string) => void;
}

const SingleOptionQuestion = ({
  id,
  content,
  options,
  onChange,
}: SingleOptionQuestionProps) => {
  const radioName = React.useMemo(() => `single-option-question-${id}`, [id]);
  const handleValueChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(id, e.target.value),
    [id, onChange],
  );

  return (
    <>
      <div className="text-xl text-sky-900">{content}</div>
      <div className="mb-2" />
      <ul>
        {options.map((option, opIndex) => {
          const htmlId = `question-${id}-option-${opIndex}`;
          return (
            <li key={option} className="flex items-center justify-start mb-1">
              <input
                id={htmlId}
                type="radio"
                name={radioName}
                value={option}
                onChange={handleValueChange}
              />
              <span className="mr-2" />
              <label htmlFor={htmlId} className="text-gray-700 text-sm capitalize">{option}</label>
            </li>
          );
        })}
      </ul>
      <br />
    </>
  );
};

export default React.memo(SingleOptionQuestion);
