/* eslint-disable import/no-cycle */
/* eslint-disable @babel/object-curly-spacing */
import Main from '../pages/main';
import closeThisPage from './close-page';
import { TIME_ANIMATION } from '../constants/game-constants';

export default function mainOpen() {
  closeThisPage();
  setTimeout(() => {
    new Main().run();
  }, TIME_ANIMATION);
}
