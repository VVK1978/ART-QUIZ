/* eslint-disable @babel/object-curly-spacing */
const removeChildElements = (childElements) => {
  const statsContent = document.querySelector(`${childElements}`);
  while (statsContent?.firstChild) {
    statsContent.removeChild(statsContent.firstChild);
  }
};

export { removeChildElements as default };
