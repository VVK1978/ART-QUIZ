/* eslint-disable import/no-cycle */
/* eslint-disable @babel/object-curly-spacing */
import closeThisPage from './close-page';
import Category from '../pages/category';
import { TIME_ANIMATION } from '../constants/game-constants';

export default function categoryOpen(state) {
  closeThisPage();
  setTimeout(() => {
    new Category(state).run();
  }, TIME_ANIMATION);
}
