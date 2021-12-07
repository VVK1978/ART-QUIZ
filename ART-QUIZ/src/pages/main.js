/* eslint-disable import/no-cycle */
/* eslint-disable @babel/object-curly-spacing */
import Element from '../components/element';
import Category from './category';
import Settings from './settings';
import loader from '../components/loader';
import closeThisPage from '../utils/close-page';
import MAIN_OUT_TIME, { TIME_ANIMATION } from '../constants/game-constants';

export default class Main {
  constructor() {
    this.state = {
      game: null,
      gameTitle: null,
    };
    this.body = document.body;
    this.mainElement = new Element('main', '', 'main', '');
    this.wrapper = new Element('div', '', 'wrapper', '');
    this.h1 = new Element('h1', '', 'title', 'ART QUIZ');
    this.buttonContainer = new Element('div', '', 'buttons-container', '');
    this.buttonArtists = new Element('button', 'artists', 'button', 'Художники');
    this.buttonPictures = new Element('button', 'pictures', 'button', 'Картины');
    this.buttonSettings = new Element('button', 'settings', 'button', 'Настройки');
    this.divPoster = new Element('div', '', 'poster', '');
    this.settings = new Settings();
  }

  run() {
    if (!document.querySelector('.main')) {
      this.body.append(this.mainElement.render());
      const main = document.querySelector('.main');
      main.append(this.wrapper.render());
      main.insertAdjacentHTML('afterbegin', loader());
    }
    this.main = document.querySelector('.main');
    this.main.classList.add('open');
    this.wrapper = document.querySelector('.wrapper');
    this.wrapper.append(this.h1.render());
    this.wrapper.append(this.buttonContainer.render());
    this.buttonContainer = document.querySelector('.buttons-container');
    this.buttonContainer.append(this.buttonArtists.render());
    this.buttonContainer.append(this.buttonPictures.render());
    this.buttonContainer.append(this.buttonSettings.render());
    this.wrapper.append(this.divPoster.render());
    this.handleClick();
    setTimeout(() => {
      this.main.classList.remove('open');
    }, MAIN_OUT_TIME);
  }

  handleClick() {
    if (document.querySelector('.buttons-container')) {
      this.buttonContainer = document.querySelector('.buttons-container');
      this.buttonContainer.addEventListener('click', (event) => {
        this.chooseCategory(event);
      }, { once: true });
    }
  }

  async chooseCategory(event) {
    const { id } = await event.target;
    if (id === 'settings') {
      await closeThisPage();
      setTimeout(() => {
        this.settings.run();
      }, TIME_ANIMATION);
    }

    if (id === 'pictures') {
      this.state = { ...this.state, game: id, gameTitle: 'Картины' };
      await closeThisPage();
      setTimeout(() => {
        this.category();
      }, TIME_ANIMATION);
    }

    if (id === 'artists') {
      this.state = { ...this.state, game: id, gameTitle: 'Художники' };
      await closeThisPage();
      setTimeout(() => {
        this.category();
      }, TIME_ANIMATION);
    }
  }

  category() {
    this.category = new Category(this.state);
    this.category.run();
  }
}
