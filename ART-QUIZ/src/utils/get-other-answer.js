/* eslint-disable @babel/object-curly-spacing */
import infoImages from '../constants/images';
import { ANSWERS } from '../constants/game-constants';

export default function getOtherAnswers(correctAnswer, state) {
  const { game } = state;
  const { min } = state[game];
  const { max } = state[game];
  const otherAnswers = new Array(correctAnswer);
  while (otherAnswers.length !== ANSWERS) {
    const random = Math.floor(min + Math.random() * (max - min));
    const temp = infoImages[random];
    const res = otherAnswers.find((answer) => answer.author === temp.author);
    if (!res) {
      otherAnswers.push(temp);
    }
  }
  return otherAnswers;
}
