export default function setRightAnswersDot(color, state) {
  const progressDot = document.querySelectorAll('.progress-dot');
  progressDot[state.currentQuestion - 1].style.backgroundColor = `${color}`;
}
