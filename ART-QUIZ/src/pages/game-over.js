/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable import/no-cycle */
import getCategoryResult from '../utils/get-category-result';
import Result from './result';
import categoryOpen from '../utils/category-open';
import closeThisPage from '../utils/close-page';
import { getResult } from '../utils/store';
import { TIMER_MODAL_OPEN, TIME_ANIMATION } from '../constants/game-constants';

export default class GameOver {
  constructor(state) {
    this.state = {
      gameTitle: state.gameTitle,
      game: state.game,
      id: state.id,
      good: 'Вы отлично справились!!!',
      bad: 'Вам надо сосредоточиться...)',
      green: 'green',
    };
  }

  run() {
    this.answers = getResult(this.state);
    const result = getCategoryResult(this.state);
    if (result < 9) {
      this.text = this.state.bad;
      this.style = 'red';
    }
    const content = this.renderContent(result, this.text, this.style);
    const wrapper = document.querySelectorAll('.wrapper');
    wrapper[0].insertAdjacentHTML('beforeend', content);
    this.gameOver = document.querySelector('.game-over');
    setTimeout(() => { this.gameOver.classList.add('open'); }, TIMER_MODAL_OPEN);
    this.handleClick();
  }

  renderContent(result, text, style) {
    this.html = `
    <div class="game-over">
      <div class="game-over-body">
        <div class="head">
          <div class="title">
            <h2 class="title-text">Игра окончена</h2>
          </div>
        </div>
        <div class="content">
          <h3 class="content-text">${text || this.state.good}</h3>
          <h3 class="content-text">Ваш результат:</h3>
          <p class="content-result ${style || this.state.green}">${result} правильных ответов</p>
        </div>
        <div class="footer-over">
          <div class="back back-from-over" id="over-back"></div>
          <div class="result-icon over" id="result-page"></div>
        </div>
      </div>
    </div>
    `;
    return this.html;
  }

  resultPageOpen() {
    closeThisPage();
    setTimeout(() => {
      new Result(this.answers, this.state).run();
    }, TIME_ANIMATION);
  }

  handleClick() {
    const footer = document.querySelector('.footer-over');
    footer.addEventListener('click', (event) => {
      const { target } = event;
      if (target.id === 'over-back') {
        categoryOpen();
      }
      if (target.id === 'result-page') {
        this.resultPageOpen();
      }
    });
  }
}
