/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable import/no-cycle */
//----------------------------------------------
// id - номер категории
//----------------------------------------------
import Game from './game';
import Main from './main';
import Result from './result';
import getImageUrl from '../utils/get-category-url';
import closeThisPage from '../utils/close-page';
import { getResult } from '../utils/store';
import getCategoryResult from '../utils/get-category-result';
import footerHidden from '../utils/footer-hidden';
import isLoader from '../utils/loader-state';
import { RESULTS, CATEGORIES_QUANTITY, TIME_ANIMATION } from '../constants/game-constants';

export default class Category {
  constructor(state) {
    this.state = {
      game: state.game,
      gameTitle: state.gameTitle,
      image: 1,
      id: 0,
      result: null,
    };
    footerHidden();
    this.wrapper = document.querySelectorAll('.wrapper');
    this.wrapper[0].insertAdjacentHTML('afterbegin', this.renderPage());
    isLoader();
  }

  run() {
    this.categoryContainer = document.querySelector('.category-container');
    this.createAllImage();
  }

  createAllImage() {
    this.createImage();
  }

  renderPage() {
    this.section = `
      <section id="${this.state.game}" class="category-${this.state.game}">
      <div class="category-content">
          <div class="category-head">
              <div id="back-to-main" class="back back-main">
              </div>
              <h2 class="category-title">
                ${this.state.gameTitle}
              </h2>
          </div>
          <div class="category-container">
          </div>
      </div>
      </section>
      `;
    return this.section;
  }

  renderCards() {
    const imagesPath = [];
    for (let i = 1; i <= CATEGORIES_QUANTITY; i += 1) {
      imagesPath.push(getImageUrl(this.state, i));
    }
    this.cards = '';
    Promise
      .all(imagesPath)
      .then(async (data) => {
        this.imagesPath = await data;
        this.imagesPath.forEach((path, index) => {
          this.state.id = index + 1;
          this.card = this.renderCard(path, index);
          this.cards += this.card;
        });
      })
      .then(() => {
        this.categoryContainer.insertAdjacentHTML('afterbegin', this.cards);
      });
  }

  renderCard(path, index) {
    this.src = path;
    this.correctAnswers = getCategoryResult(this.state);
    this.card = `
    <div 
    id="category-${this.state.game}-${index + 1}" 
    class="category-card ${this.correctAnswers > 0 ? 'answered' : ''}" 
    data-category="${index + 1}">
      ${index < 9 ? `0${index + 1}` : index + 1}
      <img 
        src="${this.src}"
        alt="image"
        id="category-image-${index + 1}" 
        class="category-image" 
        data-category="${index + 1}"/>
        ${this.correctAnswers > 0 ? this.renderAnswersCategory(index) : ''}
    </div >
  `;
    return this.card;
  }

  renderAnswersCategory(index) {
    this.html = `
        <div class="category-answers category-${index + 1}" data-result="1" title="Результаты категории...">
          ${this.correctAnswers}/${RESULTS}
        </div>
        `;
    return this.html;
  }

  async createImage() {
    const image = new Image();
    image.src = await getImageUrl(this.state, this.state.image);
    image.onload = () => {
      if (this.state.image === CATEGORIES_QUANTITY) {
        this.allImageLoaded();
      } else {
        this.state.image += 1;
        this.createImage();
      }
    };
  }

  async allImageLoaded() {
    isLoader();
    this.handleClick();
    await this.renderCards();
    const section = document.querySelector(`.category-${this.state.game}`);
    section.classList.add('open');
    const footer = document.querySelector('.footer');
    footer.classList.remove('hidden');
  }

  resultPageOpen() {
    this.state.id = this.state.result;
    const answers = getResult(this.state);
    new Result(answers, this.state).run();
  }

  handleClick() {
    if (document.querySelector('.category-container')) {
      this.categoryContainer.addEventListener('click', (event) => {
        this.state.id = +event.target.dataset.category;
        this.state.result = +event.target.dataset.result;
        if (this.state.id) {
          closeThisPage();
          setTimeout(() => {
            new Game(this.state).run();
            this.handleClick();
          }, TIME_ANIMATION);
        }
        if (this.state.result) {
          closeThisPage();
          setTimeout(() => {
            this.resultPageOpen();
          }, TIME_ANIMATION);
        }
      });
    }
    if (document.querySelector('.back-main')) {
      this.backArrow = document.querySelector('.back-main');
      this.backArrow.addEventListener('click', () => {
        closeThisPage();
        setTimeout(() => {
          new Main().run();
        }, TIME_ANIMATION);
      });
    }
  }
}
