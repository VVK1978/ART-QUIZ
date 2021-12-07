/* eslint-disable @babel/object-curly-spacing */
import { IMAGES_PER_CATEGORY } from '../constants/game-constants';

export default function setActiveImage(state) {
  const progressDot = document.querySelectorAll('.progress-dot');
  progressDot.forEach((dot) => {
    if (dot.classList.contains('active')) {
      dot.classList.remove('active');
    }
  });
  if (state.currentQuestion !== IMAGES_PER_CATEGORY) {
    progressDot[state.currentQuestion].classList.add('active');
  }
}
