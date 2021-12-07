export default function modal(url, author) {
  return `
    <div class="modal">
    <div class="modal-body">
      <div class="modal-head">
        <div class="modal-icon-container">
          <div class="modal-icon"></div>
        </div>
        <div class="modal-title">
          <span class="modal-title-text">Автор этой картины:</span>
            </br>
          <span class="modal-title-author">${author}</span>
        </div>
      </div>
      <div class="modal-content">
        <img class="modal-content-image" src="${url}" alt="">
      </div>
      <div class="modal-footer">
        <button class="button next-image">
          Далее
        </button>
      </div>
    </div>
  </div>
    `;
}
