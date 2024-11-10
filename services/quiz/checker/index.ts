import { QuestionCategory } from '../constants';
import SingleOptionAnswerChecker from './single-option-checker';

export interface AnswerChecker {
  check: (
    correctAnswers: string[],
    answerArr: string[],
  ) => boolean;
};

export const getAnswerChecker = (category: string) => {
  switch(category) {
    case QuestionCategory.SingleOption:
      return SingleOptionAnswerChecker;
    default:
      return null;
  }
};
