export default function getImages(data, picturesShuffled) {
  let images = '';
  picturesShuffled.forEach((image) => {
    images += `
    <div class="picture-image-container scale">
      <img 
        class="picture-image-answer scale" 
        id="answer-${image + 1}" 
        data-answer="${image + 1}" 
        src="${data[image].src}" 
        alt="image">
    </div>
    `;
  });
  return images;
}
