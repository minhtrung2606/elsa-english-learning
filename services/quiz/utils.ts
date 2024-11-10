import { QuestionCategory } from './constants';

export const isSingleOptionQuestion = (category: string): boolean => {
  return category === QuestionCategory.SingleOption;
}
