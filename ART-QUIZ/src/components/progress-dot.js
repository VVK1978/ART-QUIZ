/* eslint-disable object-curly-spacing */
export default function progressDots(length) {
  const dots = [...Array(length).keys()];
  let li = '';
  dots.forEach((el, ind) => {
    li += `
      <li class="progress-item">
        <div class="progress-dot ${ind === 0 ? 'active' : ''}" id="dot-${ind + 1}" data-dot="${ind + 1}"></div>
      </li>
          `;
  });
  const html = `<ul class="progress-container">${li}</ul>`;
  return html;
}
