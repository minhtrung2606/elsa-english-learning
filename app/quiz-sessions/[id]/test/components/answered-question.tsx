import React from 'react';

interface AnsweredQuestion {
  content: string;
  answeredValue: string | string[];
}

const AnsweredQuestion = ({ content, answeredValue }: AnsweredQuestion) => {
  return (
    <div>
      <div className="text-xl text-sky-900">{content}</div>
    </div>
  );
};

export default React.memo(AnsweredQuestion);
