/* eslint-disable no-unused-expressions */
/* eslint-disable @babel/no-unused-expressions */
/* eslint-disable object-curly-spacing */
/* eslint-disable import/no-cycle */
//----------------------------------------------
// id - номер категории
//----------------------------------------------
import Game from './game';
import Main from './main';
import Result from './result';
import Element from '../components/element';
import closeThisPage from '../utils/close-page';
import {getResult} from '../utils/store';
import getCategoryResult from '../utils/get-category-result';
import footerHidden from '../utils/footer-hidden';
import {RESULTS, CATEGORIES_QUANTITY, TIME_ANIMATION} from '../constants/game-constants';

export default class Category {
  constructor(state) {
    this.state = {
      game: state.game,
      gameTitle: state.gameTitle,
      image: 1,
      id: null,
      result: null,
    };
  }

  run() {
    footerHidden();
    this.wrapper = document.querySelectorAll('.wrapper');
    this.wrapper[0].insertAdjacentHTML('afterbegin', this.renderPage(this.state.game, this.state.gameTitle));
    this.createAllImage();
  }

  createAllImage() {
    this.createImage();
  }

  renderPage(game, gameTitle) {
    this.section = `
      <div id="loader" class="loader">Loading...</div>
      <section id="pictures" class="category-${game}">
      <div class="category-content">
          <div class="category-head">
              <div id="back-to-main" class="back back-main">
              </div>
              <h2 class="category-title">${gameTitle}</h2>
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
      imagesPath.push(this.getImageUrl(i));
    }
    this.cards = '';
    Promise
      .all(imagesPath)
      .then(async (data) => {
        this.imagesPath = await data;
        this.imagesPath.forEach((path, index) => {
          this.card = this.renderCard(path, index);
          this.cards += this.card;
        });
      })
      .then(() => {
        const categoryContainer = document.querySelector('.category-container');
        categoryContainer.insertAdjacentHTML('afterbegin', this.cards);
      })
      .then(() => {
        this.renderAnswersCategory();
      });
  }

  renderCard(path, index) {
    this.src = path;
    this.card = `
    <div id="category-${this.state.game}-${index + 1}" class="category-card" data-category="${index + 1}">
      ${index < 9 ? `0${index + 1}` : index + 1}
      <img 
        src="${this.src}"
        alt="image"
        id="category-image-${index + 1}" 
        class="category-image" 
        data-category="${index + 1}"/>
    </div >
  `;
    return this.card;
  }

  renderAnswersCategory() {
    [...Array(CATEGORIES_QUANTITY).keys()].forEach((index) => {
      this.state = {...this.state, id: index + 1};
      this.correctAnswers = getCategoryResult(this.state);
      if (this.correctAnswers > 0) {
        this.answers = new Element('div', '', `category-answers category-${index + 1}`, '').render();
        const category = document.getElementById(`category-${this.state.game}-${index + 1}`);
        category.classList.add('answered');
        category.insertAdjacentElement('beforeend', this.answers);
        const answers = document.querySelector(`.category-${index + 1}`);
        answers.textContent = `${this.correctAnswers}/${RESULTS}`;
        answers.title = 'Результаты категории...';
        answers.setAttribute('data-result', index + 1);
      }
    });
  }

  getImageUrl(imageNumber) {
    if (this.state.game === 'artists') {
      return import(`../../public/asset/images/bg/artists/${imageNumber}.webp`)
        .then((data) => data.default);
    }
    return import(`../../public/asset/images/bg/pictures/${imageNumber}.webp`)
      .then((data) => data.default);
  }

  async createImage() {
    const image = new Image();
    image.src = await this.getImageUrl(this.state.image);
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
    const loader = document.querySelector('.loader');
    loader.classList.add('loader-hidden');
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
      this.categoryContainer = document.querySelector('.category-container');
      this.categoryContainer.addEventListener('click', (event) => {
        this.state.id = +event.target.dataset.category;
        this.state.result = +event.target.dataset.result;
        if (this.state.id) {
          closeThisPage();
          setTimeout(() => {
            new Game(this.state.id, this.state.gameTitle).run();
            this.handleClick();
          }, TIME_ANIMATION);
        }
        if (this.state.result) {
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
    if (document.querySelector('.back-category')) {
      this.backArrow = document.querySelector('.back-category');
      this.backArrow.addEventListener('click', () => {
        setTimeout(() => {
          this.backToCategory();
        }, TIME_ANIMATION);
      });
    }
  }

  backToCategory() {
    new Category(this.state).run();
  }
}
