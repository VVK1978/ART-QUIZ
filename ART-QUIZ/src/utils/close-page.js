/* eslint-disable @babel/object-curly-spacing */
import removeChildElements from './remove-child-elements';

const closePage = async (TIME_ANIMATION = 500) => {
  const main = document.querySelector('.main');
  main.classList.add('close');
  await setTimeout(() => {
    main.classList.remove('close');
    removeChildElements('.wrapper');
  }, TIME_ANIMATION);
};

export { closePage as default };
