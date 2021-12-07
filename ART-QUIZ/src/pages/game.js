/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable import/no-cycle */
import GameOver from './game-over';
import Main from './main';
import Element from '../components/element';
import closeThisPage from '../utils/close-page';
import infoImages from '../constants/images';
import removeChildElements from '../utils/remove-child-elements';
import fault from '../../public/asset/icons/fault.svg';
import faultAudio from '../../public/asset/mp3/fault.mp3';
import trueAudio from '../../public/asset/mp3/true.mp3';
import modal from '../components/modal';
import Result from './result';
import { saveGameResults, getResult } from '../utils/store';
import progressDots from '../components/progress-dot';
import getButtons from '../components/buttons';
import getImages from '../utils/get-images';
import shuffle from '../utils/shuffle';
import animationStyle from '../constants/animationstyle';
import homeIcon from '../../public/asset/icons/home.svg';
import {
  IMAGES_PER_CATEGORY,
  ANSWERS,
  TIME_ANIMATION,
  TIMER_MODAL_OPEN,
  TIMER_SLIDE_IMAGE,
  TIMER_ACTIVE_IMAGE,
} from '../constants/game-constants';

export default class Game {
  constructor(id, game) {
    this.id = id;
    this.game = game;
    this.answers = JSON.parse(localStorage.getItem('results'))[game];
    this.settings = JSON.parse(localStorage.getItem('settings'));
    this.animation = animationStyle;
    this.categoryFirstImagePosition = (this.id - 1) * IMAGES_PER_CATEGORY;
    this.state = {
      game,
      id,
      currentQuestion: 1,
      Художники: {
        min: 0,
        max: 119,
        firstImagePosition: this.categoryFirstImagePosition,
        mainQuestion: 'Кто автор данной картины?',
      },
      Картины: {
        min: 120,
        max: 239,
        firstImagePosition: 120 + this.categoryFirstImagePosition,
        mainQuestion: 'Какую из этих картин написал ',
      },
    };
    this.section = new Element('section', '', 'game', '');
    this.backArrow = new Element('div', 'back-category', 'back back-category', '');
    this.gameContent = new Element('div', '', 'game-content', '');
    this.gameHead = new Element('div', '', 'game-head', '');
    this.gameTitle = new Element('h2', '', 'game-title', `${this.state.game}`);
    this.homeIcon = new Element('img', 'home', 'home-icon', '');
    this.gameContainer = new Element('div', '', 'game-container', '');
    this.questionContainer = new Element('div', '', 'question-container', '');
    this.questionContent = new Element('span', '', 'question-text', this.state[this.state.game].mainQuestion);
    this.imagesContainer = new Element('div', '', 'images-container', '');
    this.answerContainer = new Element('div', '', 'answer-container', '');
    this.answerProgress = new Element('div', '', 'answer-progress', '');
    this.answerButtonsContainer = new Element('div', '', 'answer-buttons-container', '');
  }

  run() {
    this.wrapper = document.querySelectorAll('.wrapper');
    this.wrapper[0].append(this.section.render());
    this.section = document.querySelector('.game');
    this.section.append(this.gameContent.render());
    this.gameContent = document.querySelector('.game-content');
    this.gameContent.append(this.gameHead.render());
    this.gameHead = document.querySelector('.game-head');
    this.gameHead.append(this.backArrow.render());
    this.gameHead.append(this.gameTitle.render());
    this.gameHead.append(this.homeIcon.render());
    this.homeIcon = document.querySelector('.home-icon');
    this.gameContent.append(this.gameContainer.render());
    this.gameContainer = document.querySelector('.game-container');
    this.gameContainer.append(this.questionContainer.render());
    this.questionContainer = document.querySelector('.question-container');
    this.questionContainer.append(this.questionContent.render());
    this.gameContainer.append(this.imagesContainer.render());
    this.imagesContainer = document.querySelector('.images-container');
    this.homeIcon.src = homeIcon;
    this.handleClick();
    this.gameSelection(this.state.game, this.state.id);
    this.homeClick();
  }

  async gameSelection(game) {
    this.questions = await this.getCorrectAnswers();
    if (game === 'Художники') {
      this.gameArtists();
    } else {
      this.gamePictures();
    }
  }

  getCorrectAnswers() {
    const firstImage = this.state[this.game].firstImagePosition;
    const lastImage = this.state[this.game].firstImagePosition + IMAGES_PER_CATEGORY + this.categoryFirstImagePosition;
    const correctAnswers = [];
    for (let i = firstImage; i < lastImage; i += 1) {
      correctAnswers.push(infoImages[i]);
    }
    return correctAnswers;
  }

  gameArtists() {
    const promise = new Promise((resolve) => {
      const classData = 'game-artists-image';
      resolve(this.createImage(this.questions[this.state.currentQuestion - 1], classData));
    });
    promise
      .then(() => {
        this.progress();
      })
      .then(() => {
        this.gameContainer.append(this.answerButtonsContainer.render());
      })
      .then(() => {
        this.answerButtons(this.questions[this.state.currentQuestion - 1]);
        this.answerClick();
      });
  }

  async getImageUrl(question) {
    if (this.state.game === 'Художники') {
      this.url = await import(`../../public/asset/images/img/${question.imageNum}.jpg`)
        .then((data) => data.default);
    } else {
      this.url = await import(`../../public/asset/images/full/${question.imageNum}full.jpg`)
        .then((data) => data.default);
    }
    return this.url;
  }

  async createImage(question, classData) {
    const url = await this.getImageUrl(question);
    const image = new Image();
    this.imagesContainer.append(image);
    image.src = url;
    image.classList.add(`${classData}`);
    return new Promise((resolve) => {
      image.onload = () => {
        resolve();
      };
    });
  }

  async drawNewImage(question) {
    this.image = document.querySelector('.game-artists-image');
    this.image.src = await this.getImageUrl(question);
  }

  async progress() {
    const imagesContainer = document.querySelector('.images-container');
    imagesContainer.classList.add('open');
    const html = await progressDots(IMAGES_PER_CATEGORY);
    this.gameContainer.append(this.answerProgress.render());
    this.answerProgress = document.querySelector('.answer-progress');
    this.answerProgress.insertAdjacentHTML('afterbegin', html);
  }

  setActiveImage(activeCurrent) {
    this.progressDot = document.querySelectorAll('.progress-dot');
    this.progressDot.forEach((dot) => {
      if (dot.classList.contains('active')) {
        dot.classList.remove('active');
      }
    });
    if (activeCurrent !== IMAGES_PER_CATEGORY) {
      this.progressDot[activeCurrent].classList.add('active');
    }
  }

  getOtherAnswers(correctAnswer) {
    const { min } = this.state[this.game];
    const { max } = this.state[this.game];
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

  answerButtons(question) {
    removeChildElements('.answer-buttons-container');
    const correctAnswer = question;
    this.allAnswer = this.getOtherAnswers(correctAnswer);
    const buttonsShuffled = shuffle([...Array(ANSWERS).keys()]);
    this.buttons = getButtons(buttonsShuffled, this.allAnswer);
    this.answerButtonsContainer = document.querySelector('.answer-buttons-container');
    this.answerButtonsContainer.insertAdjacentHTML('afterbegin', this.buttons);
  }

  checkAnswer(event) {
    const { answer } = event.target.dataset;
    if (this.state.currentQuestion <= IMAGES_PER_CATEGORY) {
      this.counterAnswer(answer === '1');
      this.modalAnswer(answer);
      setTimeout(() => {
        this.setActiveImage(this.state.currentQuestion);
      }, TIMER_ACTIVE_IMAGE);
    }
    if (this.state.currentQuestion === IMAGES_PER_CATEGORY) {
      saveGameResults(this.answers, this.state.game, this.state.id);
    }
  }

  counterAnswer(isAnswer) {
    if (isAnswer) {
      this.setRightAnswersDot('green');
      this.playClick(trueAudio);
    } else {
      this.setRightAnswersDot('red');
      this.playClick(faultAudio);
    }
    this.answers[this.id].categoryAnswers[this.state.currentQuestion] = isAnswer;
  }

  playClick(audioFile) {
    const audio = new Audio(audioFile);
    audio.volume = this.settings.volume;
    audio.play();
  }

  setRightAnswersDot(color) {
    this.progressDot = document.querySelectorAll('.progress-dot');
    this.progressDot[this.state.currentQuestion - 1].style.backgroundColor = `${color}`;
  }

  async modalAnswer(result) {
    this.url = await this.getImageUrl(this.questions[this.state.currentQuestion - 1]);
    this.author = this.questions[this.state.currentQuestion - 1].author;
    this.modal = modal(this.url, this.author);
    this.answerButtonsContainer.insertAdjacentHTML('afterend', this.modal);
    this.modal = await document.querySelector('.modal');
    this.modalIcon = document.querySelector('.modal-icon');
    setTimeout(() => {
      this.modal.classList.add('open');
      if (result !== '1') {
        this.modalIcon.style.backgroundImage = `url(${fault})`;
      }
      this.nextImage();
    }, TIMER_MODAL_OPEN);
  }

  slideImage() {
    const nextQuestion = this.questions[this.state.currentQuestion];
    this.imagesContainer.classList.add(`${this.animation[this.game].slideOut}`);
    setTimeout(() => {
      if (this.state.game === 'Художники') {
        this.answerButtons(nextQuestion);
        this.drawNewImage(nextQuestion);
      } else {
        this.nextPictures(nextQuestion);
      }
    }, TIMER_SLIDE_IMAGE);
    setTimeout(() => {
      this.imagesContainer.classList.remove(`${this.animation[this.game].slideOut}`);
      this.imagesContainer.classList.add(`${this.animation[this.game].slideIn}`);
      this.questionContent.textContent = `
      ${this.state[this.game].mainQuestion} ${this.questions[this.state.currentQuestion].author} ?`;
      this.state.currentQuestion += 1;
    }, TIMER_SLIDE_IMAGE);
  }

  async gamePictures() {
    this.questionContent = document.querySelector('.question-text');
    this.questionContent.textContent = `
    ${this.state[this.game].mainQuestion} ${this.questions[this.state.currentQuestion - 1].author} ?`;
    this.imagesContainer.classList.add(['picture-game'], ['answer-buttons-container']);
    this.answerPictures(this.questions[this.state.currentQuestion - 1]);
    this.answerClick();
  }

  answerPictures(question) {
    const correctAnswer = question;
    const allAnswer = this.getOtherAnswers(correctAnswer);
    const indexShuffled = shuffle([...Array(ANSWERS).keys()]);
    const urls = [];
    allAnswer.forEach((answer) => {
      urls.push(this.getImageUrl(answer));
    });
    Promise.all(urls)
      .then((data) => {
        const images = getImages(data, indexShuffled);
        this.imagesContainer.insertAdjacentHTML('beforeend', images);
      })
      .then(() => this.progress());
  }

  nextPictures(question) {
    const correctAnswer = question;
    const allAnswer = this.getOtherAnswers(correctAnswer);
    const indexShuffled = shuffle([...Array(ANSWERS).keys()]);
    const urls = [];
    const images = document.querySelectorAll('.picture-image-answer');
    allAnswer.forEach((answer) => {
      urls.push(this.getImageUrl(answer));
    });
    Promise.all(urls)
      .then((data) => {
        images.forEach((image, index) => {
          image.setAttribute('src', data[indexShuffled[index]]);
          image.setAttribute('id', indexShuffled[index] + 1);
          image.setAttribute('data-answer', indexShuffled[index] + 1);
        });
      });
  }

  resultPageOpen() {
    const answers = getResult(this.state.game, this.state.id);
    new Result(answers, this.state.id, this.state.game).run();
  }

  // --------------------ALL EVENTS---------------------

  handleClick() {
    if (document.querySelector('.back-category')) {
      this.backArrow = document.querySelector('.back');
      this.backArrow.addEventListener('click', () => {
        closeThisPage();
      });
    }
  }

  answerClick() {
    this.answerButtonsContainer = document.querySelector('.answer-buttons-container');
    this.answerButtonsContainer.addEventListener('click', (event) => {
      if (event.target.dataset.answer) {
        this.checkAnswer(event);
      }
    });
  }

  homeClick() {
    this.homeIcon.addEventListener('click', () => {
      closeThisPage();
      setTimeout(() => {
        new Main().run();
      }, TIME_ANIMATION);
    }, { once: true });
  }

  nextImage() {
    const nextImage = document.querySelector('.next-image');
    nextImage.addEventListener('click', () => {
      this.modal.classList.remove('open');
      if (this.state.currentQuestion < IMAGES_PER_CATEGORY) {
        this.slideImage();
      }
      if (this.state.currentQuestion === IMAGES_PER_CATEGORY) {
        new GameOver(this.game, this.id).run();
      }
    }, { once: true });
  }
}
