import Result from '../pages/result';
import getResult from './store';

export default function resultPageOpen(idResult) {
  const answers = getResult(gameTitle, idResult);
  new Result(answers, idResult, gameTitle).run();
}
