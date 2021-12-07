/* eslint-disable import/no-cycle */
/* eslint-disable @babel/object-curly-spacing */
import GameOver from './game-over';
import Element from '../components/element';
import getButtons from '../components/buttons';
import infoImages from '../constants/images';
import fault from '../../public/asset/icons/fault.svg';
import faultAudio from '../../public/asset/mp3/fault.mp3';
import trueAudio from '../../public/asset/mp3/true.mp3';
import modal from '../components/modal';
import categoryOpen from '../utils/category-open';
import mainOpen from '../utils/main-open';
import getOtherAnswers from '../utils/get-other-answer';
import { saveGameResults } from '../utils/store';
import loader from '../components/loader';
import progressDots from '../components/progress-dot';
import removeChildElements from '../utils/remove-child-elements';
import setActiveImage from '../utils/set-active-image';
import setRightAnswersDot from '../utils/set-answer-dot';
import setLoader from '../utils/set-loader';
import createImage from '../utils/create-image';
import getImageUrl from '../utils/get-image-url';
import getImages from '../utils/get-images';
import playAudio from '../utils/play-audio';
import shuffle from '../utils/shuffle';
import animationStyle from '../constants/animationstyle';
import homeIcon from '../../public/asset/icons/home.svg';
import {
  IMAGES_PER_CATEGORY,
  ANSWERS,
  TIMER_MODAL_OPEN,
  TIMER_SLIDE_IMAGE,
  TIMER_ACTIVE_IMAGE,
  ARTISTS_FIRST_IMAGE,
  PICTURES_FIRST_IMAGE,
} from '../constants/game-constants';

export default class Game {
  constructor(state) {
    this.id = state.id;
    this.game = state.game;
    this.categoryFirstImagePosition = (this.id - 1) * IMAGES_PER_CATEGORY;
    this.state = {
      id: state.id,
      game: state.game,
      gameTitle: state.gameTitle,
      currentQuestion: 1,
      startImagePosition:
        state.game === 'artists'
          ? ARTISTS_FIRST_IMAGE + this.categoryFirstImagePosition
          : PICTURES_FIRST_IMAGE + this.categoryFirstImagePosition,
      artists: {
        min: 0,
        max: 119,
        mainQuestion: 'Кто автор данной картины?',
      },
      pictures: {
        min: 120,
        max: 239,
        mainQuestion: 'Какую из этих картин написал ',
      },
    };
    this.answers = JSON.parse(localStorage.getItem('results'))[this.state.gameTitle];
    this.animation = animationStyle;
    this.section = new Element('section', '', 'game', '');
    this.backArrow = new Element('div', 'back-category', 'back back-category', '');
    this.gameContent = new Element('div', '', 'game-content', '');
    this.gameHead = new Element('div', '', 'game-head', '');
    this.gameTitle = new Element('h2', '', 'game-title', `${this.state.gameTitle}`);
    this.homeIcon = new Element('img', 'home', 'home-icon', '');
    this.gameContainer = new Element('div', '', 'game-container', '');
    this.questionContainer = new Element('div', '', 'question-container', '');
    this.questionContent = new Element('span', '', 'question-text', this.state[this.game].mainQuestion);
    this.imagesContainer = new Element('div', '', 'images-container', '');
    this.answerContainer = new Element('div', '', 'answer-container', '');
    this.answerProgress = new Element('div', '', 'answer-progress', '');
    this.answerButtonsContainer = new Element('div', '', 'answer-buttons-container', '');
  }

  run() {
    this.wrapper = document.querySelectorAll('.wrapper');
    this.wrapper[0].append(this.section.render());
    this.wrapper[0].insertAdjacentHTML('afterbegin', loader());
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
    this.gameSelection();
    this.backClick();
    this.homeClick();
  }

  async gameSelection() {
    this.correctAnswers = await this.getCorrectAnswers();
    if (this.state.game === 'artists') {
      this.gameArtists();
    } else {
      this.gamePictures();
    }
  }

  getCorrectAnswers() {
    const firstImage = this.state.startImagePosition;
    const correctAnswers = [];
    for (let i = firstImage; i < firstImage + IMAGES_PER_CATEGORY; i += 1) {
      correctAnswers.push(infoImages[i]);
    }
    return correctAnswers;
  }

  async gameArtists() {
    removeChildElements('.images-container');
    setLoader();
    const currentImage = this.state.startImagePosition + this.state.currentQuestion - 1;
    const url = await getImageUrl(this.state, currentImage);
    const promise = new Promise((resolve) => {
      resolve(createImage(url));
    });
    promise
      .then((data) => {
        this.imagesContainer.append(data);
        data.classList.add('game-artists-image');
      })
      .then(() => {
        if (!document.querySelector('.answer-progress')) {
          this.progress();
        }
      })
      .then(() => {
        if (!document.querySelector('.answer-buttons-container')) {
          this.gameContainer.append(this.answerButtonsContainer.render());
        }
      })
      .then(() => {
        this.answerButtons(this.correctAnswers[this.state.currentQuestion - 1]);
        this.answerClick();
        setLoader();
      });
  }

  async progress() {
    const imagesContainer = document.querySelector('.images-container');
    imagesContainer.classList.add('open');
    const html = await progressDots(IMAGES_PER_CATEGORY);
    this.gameContainer.append(this.answerProgress.render());
    this.answerProgress = document.querySelector('.answer-progress');
    this.answerProgress.insertAdjacentHTML('afterbegin', html);
  }

  answerButtons(question) {
    removeChildElements('.answer-buttons-container');
    const correctAnswer = question;
    this.allAnswer = getOtherAnswers(correctAnswer, this.state);
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
        setActiveImage(this.state);
      }, TIMER_ACTIVE_IMAGE);
    }
    if (this.state.currentQuestion === IMAGES_PER_CATEGORY) {
      saveGameResults(this.answers, this.state);
    }
  }

  counterAnswer(isAnswer) {
    if (isAnswer) {
      setRightAnswersDot('green', this.state);
      playAudio(trueAudio);
    } else {
      setRightAnswersDot('red', this.state);
      playAudio(faultAudio);
    }
    this.answers[this.id].categoryAnswers[this.state.currentQuestion] = isAnswer;
  }

  async modalAnswer(result) {
    const currentImage = this.state.startImagePosition + this.state.currentQuestion - 1;
    const url = await getImageUrl(this.state, currentImage);
    const { author } = infoImages[currentImage];
    this.modal = modal(url, author);
    this.answerButtonsContainer.insertAdjacentHTML('afterend', this.modal);
    this.modal = await document.querySelector('.modal');
    const modalIcon = document.querySelector('.modal-icon');
    setTimeout(() => {
      this.modal.classList.add('open');
      if (result !== '1') {
        modalIcon.style.backgroundImage = `url(${fault})`;
      }
      this.nextClick();
    }, TIMER_MODAL_OPEN);
  }

  nextImage() {
    const nextQuestion = this.correctAnswers[this.state.currentQuestion - 1];
    this.imagesContainer.classList.add(`${this.animation[this.game].slideOut}`);
    setTimeout(() => {
      if (this.state.game === 'artists') {
        this.gameArtists();
      } else {
        this.answerPictures(nextQuestion);
      }
    }, TIMER_SLIDE_IMAGE);
    setTimeout(() => {
      this.imagesContainer.classList.remove(`${this.animation[this.game].slideOut}`);
      this.imagesContainer.classList.add(`${this.animation[this.game].slideIn}`);
      this.questionContent.textContent = `
      ${this.state[this.game].mainQuestion} ${this.correctAnswers[this.state.currentQuestion - 1].author} ?`;
    }, TIMER_SLIDE_IMAGE);
  }

  async gamePictures() {
    this.questionContent = document.querySelector('.question-text');
    this.questionContent.textContent = `
    ${this.state[this.game].mainQuestion} ${this.correctAnswers[this.state.currentQuestion - 1].author} ?`;
    this.imagesContainer.classList.add(['picture-game'], ['answer-buttons-container']);
    this.answerPictures(this.correctAnswers[this.state.currentQuestion - 1]);
  }

  async answerPictures(question) {
    setLoader();
    this.answerClick();
    removeChildElements('.answer-buttons-container');
    const correctAnswer = question;
    const allAnswer = getOtherAnswers(correctAnswer, this.state);
    const indexShuffled = shuffle([...Array(ANSWERS).keys()]);
    const urls = [];
    allAnswer.forEach((answer) => {
      urls.push(getImageUrl(false, answer.imageNum));
    });
    Promise
      .all(urls)
      .then((result) => {
        const images = [];
        result.forEach((url) => images.push(createImage(url)));
        Promise
          .all(images)
          .then((data) => {
            setLoader();
            const dataImages = getImages(data, indexShuffled);
            this.imagesContainer.insertAdjacentHTML('beforeend', dataImages);
          })
          .then(() => {
            if (!document.querySelector('.answer-progress')) {
              this.progress();
            }
          });
      });
  }

  // --------------------ALL EVENTS---------------------

  backClick() {
    if (document.querySelector('.back-category')) {
      this.backArrow = document.querySelector('.back');
      this.backArrow.addEventListener('click', () => {
        categoryOpen(this.state);
      });
    }
  }

  answerClick() {
    this.answerButtonsContainer = document.querySelector('.answer-buttons-container');
    this.answerButtonsContainer.addEventListener('click', (event) => {
      if (event.target.dataset.answer) {
        this.checkAnswer(event);
      }
    }, { once: true });
  }

  homeClick() {
    this.homeIcon.addEventListener('click', () => {
      mainOpen();
    }, { once: true });
  }

  nextClick() {
    const nextImage = document.querySelector('.next-image');
    nextImage.addEventListener('click', () => {
      this.modal.classList.remove('open');
      this.state.currentQuestion += 1;
      if (this.state.currentQuestion - 1 < IMAGES_PER_CATEGORY) {
        this.nextImage();
      }
      if (this.state.currentQuestion - 1 === IMAGES_PER_CATEGORY) {
        new GameOver(this.state).run();
      }
    }, { once: true });
  }
}
