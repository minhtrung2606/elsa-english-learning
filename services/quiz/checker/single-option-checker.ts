import { AnswerChecker } from '.';

const SingleOptionAnswerChecker: AnswerChecker = {
  check: (correctAnswers: string[], answerArr: string[]) => {
    return correctAnswers.includes(answerArr[0]);
  },
};

export default SingleOptionAnswerChecker;
