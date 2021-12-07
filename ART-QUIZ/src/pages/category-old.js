/* eslint-disable no-restricted-syntax */
/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable no-unused-expressions */
/* eslint-disable @babel/no-unused-expressions */
/* eslint-disable import/no-cycle */
import Element from '../components/element';
import Game from './game';
import Main from './main';
import Result from './result';
import closePage from '../utils/close-page';
import { getResult } from '../utils/store';

const TIME_ANIMATION = 500;
const RESULTS = 10;
const CATEGORIES_QUANTITY = 12;

export default class Category {
  constructor(game = 'artists', title) {
    this.game = game;
    this.gameTitle = title;
    this.section = new Element('section', `${this.game}`, `category-${this.game}`, '');
    this.loader = new Element('div', 'loader', 'loader', 'Loading...');
    this.backArrow = new Element('div', 'back-to-main', 'back back-main', '');
    this.categoryContent = new Element('div', '', 'category-content', '');
    this.categoryHead = new Element('div', '', 'category-head', '');
    this.categoryTitle = new Element('h2', '', 'category-title', `${this.gameTitle}`);
    this.categoryContainer = new Element('div', '', 'category-container', '');
  }

  async run() {
    this.wrapper = document.querySelector('.wrapper');
    this.wrapper.append(this.section.render());
    this.section = document.querySelector(`.category-${this.game}`);
    this.section.append(this.categoryContent.render());
    this.categoryContent = document.querySelector('.category-content');
    this.categoryContent.append(this.categoryHead.render());
    this.categoryHead = document.querySelector('.category-head');
    this.categoryHead.append(this.backArrow.render());
    this.categoryHead.append(this.categoryTitle.render());
    this.categoryHead.after(this.loader.render());
    this.loader = document.querySelector('.loader');
    this.categoryContent.append(this.categoryContainer.render());
    this.categoryContainer = document.querySelector('.category-container');
    this.imagesPath = [];
    for (let i = 1; i <= CATEGORIES_QUANTITY; i += 1) {
      this.imagesPath.push(this.getCategoryData(i));
    }
    this.createCategoryCard(this.imagesPath);
    this.handleClick();
  }

  async getCategoryData(imageNumber) {
    if (this.game === 'artists') {
      return import(`../../public/asset/images/bg/artists/${imageNumber}.webp`).then((data) => data.default);
    }
    return import(`../../public/asset/images/bg/pictures/${imageNumber}.webp`).then((data) => data.default);
  }

  async createCategoryCard(imagesPath) {
    Promise.all(imagesPath)
      .then((paths) => {
        this.paths = paths;
        this.paths.forEach((path, index) => {
          this.category = new Element('div', `category-${this.game}-${index + 1}`, 'category-card', '').render();
          this.categoryContainer.append(this.category);
          const category = document.getElementById(`category-${this.game}-${index + 1}`);
          (index < 9) ? this.index = `0${index + 1}` : this.index = index + 1;
          category.dataset.category = index + 1;
          category.textContent = this.index;
        });
      })
      .then(() => {
        this.paths.forEach((path, index) => {
          this.categoryImage = new Element('div', `category-image-${index + 1}`, 'category-image', '').render();
          const category = document.getElementById(`category-${this.game}-${index + 1}`);
          category.insertAdjacentElement('beforeend', this.categoryImage);
          const categoryImage = document.getElementById(`category-image-${index + 1}`);
          categoryImage.dataset.category = index + 1;
          categoryImage.setAttribute('style', `background-image: url('${path}')`);
        });
      })
      .then(() => {
        this.paths.forEach((path, index) => {
          this.correctAnswers = this.getCategoryResult(index + 1);
          if (this.correctAnswers > 0) {
            this.answers = new Element('div', '', `category-answers category-${index + 1}`, '').render();
            const category = document.getElementById(`category-${this.game}-${index + 1}`);
            category.classList.add('answered');
            category.insertAdjacentElement('beforeend', this.answers);
            const answers = document.querySelector(`.category-${index + 1}`);
            answers.textContent = `${this.correctAnswers}/${RESULTS}`;
            answers.title = 'Результаты категории...';
            answers.setAttribute('data-result', index + 1);
          }
        });
      })
      .then(() => {
        this.section.classList.add('open');
        this.loader.classList.add('loader-hidden');
      });
  }

  getCategoryResult(index) {
    this.result = getResult(this.gameTitle, index).categoryAnswers;
    this.correctAnswersCount = 0;
    Object.entries(this.result).forEach((item) => {
      if (item[1]) {
        this.correctAnswersCount += 1;
      }
    });
    return this.correctAnswersCount;
  }

  resultPageOpen(idResult) {
    const answers = getResult(this.gameTitle, idResult);
    new Result(answers, idResult, this.gameTitle).run();
  }

  handleClick() {
    if (document.querySelector('.category-container')) {
      this.categoryContainer = document.querySelector('.category-container');
      this.categoryContainer.addEventListener('click', (event) => {
        const idCategory = +event.target.dataset.category;
        const idResult = +event.target.dataset.result;
        if (idCategory) {
          closePage();
          setTimeout(() => {
            this.gameNew = new Game(idCategory, this.gameTitle);
            this.gameNew.run();
            this.handleClick();
          }, TIME_ANIMATION);
        }
        if (idResult) {
          setTimeout(() => {
            this.resultPageOpen(idResult);
          }, TIME_ANIMATION);
        }
      });
    }
    if (document.querySelector('.back-main')) {
      this.backArrow = document.querySelector('.back-main');
      this.backArrow.addEventListener('click', () => {
        closePage();
        setTimeout(() => {
          this.main = new Main();
          this.main.run();
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
    new Category(this.game, this.gameTitle).run();
  }
}
