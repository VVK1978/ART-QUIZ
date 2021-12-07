/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable import/no-cycle */
import getImageUrl from '../utils/get-image-url';
import infoImages from '../constants/images';
import closeThisPage from '../utils/close-page';
import Category from './category';
import getCategoryResult from '../utils/get-category-result';
import getCategoryImagePath from '../utils/get-category-url';
import {
  RESULTS,
  IMAGES_PER_CATEGORY,
  TIME_ANIMATION,
  TIMER_MODAL_OPEN,
} from '../constants/game-constants';

export default class Result {
  constructor(answers, state) {
    this.answers = answers;
    this.firstCategoryImagePosition = (state.id - 1) * IMAGES_PER_CATEGORY;
    if (state.gameTitle === 'Художники') {
      this.startPosition = 0;
    } else {
      this.startPosition = 120;
    }
    this.state = {
      gameTitle: state.gameTitle,
      game: state.game,
      id: state.id,
      imagePosition: this.startPosition + this.firstCategoryImagePosition,
    };
  }

  run() {
    this.renderContent();
  }

  renderContent() {
    const urls = [];
    [...Array(RESULTS).keys()].forEach((index) => {
      urls.push(getImageUrl(this.state, index));
    });
    Promise
      .all(urls)
      .then((data) => {
        this.resultContent = this.getResultContent(data);
      })
      .then(() => {
        this.categoryImagePath = getCategoryImagePath(this.state);
      })
      .then(async () => {
        this.categoryImageContent = await this.getCategoryImageContent(this.state.id);
      })
      .then(() => {
        this.resultPageContent = this.getResultPageContent(this.categoryImageContent, this.resultContent);
      })
      .then(() => {
        const wrapper = document.querySelectorAll('.wrapper');
        wrapper[0].insertAdjacentHTML('beforeend', this.resultPageContent);
      })
      .then(() => {
        this.result = document.querySelector('.result');
        setTimeout(() => { this.result.classList.add('open'); }, TIMER_MODAL_OPEN);
      })
      .then(() => {
        this.handleClick();
        this.contentClick();
      });
  }

  getResultContent(data) {
    this.resultContent = '';
    data.forEach((url, index) => {
      const style = this.getResult(this.answers.categoryAnswers[index + 1]);
      const imageData = infoImages[this.state.imagePosition + index];
      const { name } = imageData;
      const { author } = imageData;
      const { year } = imageData;
      this.resultContent += `
        <div class="result-content-image-container" id="result-${index}">
          <img class="result-content-image ${style}" src="${url}" alt="image" data-image=${index}/>
          <div class="result-content-icon ${style}"></div>
          <div class="image-info">
            <p>
              Название:
            </p>
            <span class="info-name-text">${name}</span>
            <p class="info-author-title">
            Автор:
            </p>
            <span class="info-author-text">${author}</span>
            <p class="info-year-title">
            Год:
            </p>  
            <span class="info-year-text">${year}</span>
          </div>
        </div>
    `;
    });
    return this.resultContent;
  }

  async getCategoryImageContent() {
    const answerCorrectCount = getCategoryResult(this.state);
    let result = null;
    if (this.state.id < 10) {
      result = `0${this.state.id}`;
    } else {
      result = this.state.id;
    }
    const src = await getCategoryImagePath(this.state);
    return `
      <div class="result-image-container">
        <img class="result-category-image" src="${src}" alt="image-category">
        <div class="result-category">
          ${result}
        </div>
        <div class="result-category-answered">
          ${answerCorrectCount}/${RESULTS}
        </div>
      </div>
          `;
  }

  getResultPageContent(categoryImage, resultContent) {
    this.html = `
    <div class="result">
      <div class="result-body">
        <div class="result-head">
          <div class="result-title">
            <div class="back back-from-result" id="result-back"></div>
            <h2 class="result-title-text">Результаты</h2>
          </div>
          ${categoryImage}
        </div>
        <div class="result-content">
        ${resultContent}
        </div>
        <div class="result-footer">
        </div>
      </div>
    </div>
    `;
    return this.html;
  }

  getResult(result) {
    this.result = result;
    return (result) ? 'success' : 'fault';
  }

  infoPicture(event) {
    const target = event.target.dataset.image;
    if (target) {
      this.openInfoPicture(target[0]);
    } else { this.openInfoPicture(null); }
  }

  openInfoPicture(id) {
    const info = document.querySelectorAll('.image-info');
    info.forEach((item) => {
      if (item.classList.contains('open')) {
        item.classList.remove('open');
      }
    });
    if (id) {
      info[id].classList.add('open');
    }
    return this;
  }

  categoryPageOpen() {
    closeThisPage();
    this.footer = document.querySelector('.footer');
    this.footer.classList.add('hidden');
    setTimeout(() => {
      this.category = new Category(this.state);
      this.category.run();
    }, TIME_ANIMATION);
  }

  handleClick() {
    const backToCategory = document.querySelector('.back-from-result');
    backToCategory.addEventListener('click', () => {
      this.categoryPageOpen();
    });
  }

  contentClick() {
    const resultContent = document.querySelector('.result-content');
    resultContent.addEventListener('click', (event) => {
      this.infoPicture(event);
    });
  }
}
