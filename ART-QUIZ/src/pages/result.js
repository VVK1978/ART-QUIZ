/* eslint-disable @babel/object-curly-spacing */
/* eslint-disable import/no-cycle */
import infoImages from '../constants/images';
import categoryOpen from '../utils/category-open';
import getImageUrl from '../utils/get-image-url';
import isLoader from '../utils/loader-state';
import getCategoryResult from '../utils/get-category-result';
import getCategoryImagePath from '../utils/get-category-url';
import createImage from '../utils/create-image';
import {
  RESULTS,
  IMAGES_PER_CATEGORY,
  TIMER_MODAL_OPEN,
  ARTISTS_FIRST_IMAGE,
  PICTURES_FIRST_IMAGE,
} from '../constants/game-constants';

export default class Result {
  constructor(answers, state) {
    this.answers = answers;
    this.firstCategoryImagePosition = (state.id - 1) * IMAGES_PER_CATEGORY;
    this.state = {
      gameTitle: state.gameTitle,
      game: state.game,
      id: state.id,
      startImagePosition:
        state.game === 'artists'
          ? ARTISTS_FIRST_IMAGE + this.firstCategoryImagePosition
          : PICTURES_FIRST_IMAGE + this.firstCategoryImagePosition,
    };
  }

  run() {
    this.renderContent();
    isLoader();
  }

  renderContent() {
    const urls = [];
    [...Array(RESULTS).keys()].forEach((index) => {
      const currentImage = this.state.startImagePosition + index;
      urls.push(getImageUrl(this.state, currentImage));
    });
    Promise
      .all(urls)
      .then((result) => {
        const images = [];
        result.forEach((url) => {
          images.push(createImage(url));
        });
        Promise
          .all(images)
          .then((data) => {
            this.resultContent = this.renderInfoImages(data);
          })
          .then(async () => {
            this.categoryImageContent = await this.renderCategoryImage(this.state.id);
          })
          .then(() => {
            this.resultPageContent = this.renderResultPage(this.categoryImageContent, this.resultContent);
          })
          .then(() => {
            const wrapper = document.querySelectorAll('.wrapper');
            wrapper[0].insertAdjacentHTML('beforeend', this.resultPageContent);
          })
          .then(() => {
            this.result = document.querySelector('.result');
            setTimeout(() => { this.result.classList.add('open'); }, TIMER_MODAL_OPEN);
            this.backClick();
            this.contentClick();
            isLoader();
          });
      });
  }

  renderInfoImages(images) {
    this.resultContent = '';
    images.forEach((image, index) => {
      const style = this.getResult(this.answers.categoryAnswers[index + 1]);
      const imageData = infoImages[this.state.startImagePosition + index];
      const { name } = imageData;
      const { author } = imageData;
      const { year } = imageData;
      this.resultContent += `
        <div class="result-content-image-container" id="result-${index}">
          <img class="result-content-image ${style}" src="${image.src}" alt="image" data-image=${index}/>
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

  async renderCategoryImage() {
    const categoryResult = getCategoryResult(this.state);
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
          ${categoryResult}/${RESULTS}
        </div>
      </div>
          `;
  }

  renderResultPage(categoryImage, resultContent) {
    this.html = `
    <section class="result">
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
    </section>
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
    this.footer = document.querySelector('.footer');
    this.footer.classList.add('hidden');
    categoryOpen(this.state);
  }

  backClick() {
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
