/* eslint-disable no-param-reassign */
/* eslint-disable @babel/object-curly-spacing */
import { getResult } from './store';

export default function getCategoryResult(state) {
  const result = getResult(state).categoryAnswers;
  let correctAnswersCount = 0;
  Object.entries(result).forEach((item) => {
    if (item[1]) {
      correctAnswersCount += 1;
    }
  });
  return correctAnswersCount;
}
