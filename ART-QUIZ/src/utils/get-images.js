export default function getImages(urls, picturesShuffled) {
  let buttons = '';
  picturesShuffled.forEach((button) => {
    buttons += `
    <div class="picture-image-container scale">
      <img class="picture-image-answer scale" id="answer-${button}" data-answer="${button + 1}" src="${urls[button]}" alt="image">
    </div>
    `;
  });
  return buttons;
}
