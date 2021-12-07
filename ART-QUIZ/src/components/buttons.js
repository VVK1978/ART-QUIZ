export default function getButtons(buttonsShuffled, allAnswer) {
  let buttons = '';
  buttonsShuffled.forEach((button) => {
    buttons += `
          <button class="button-answer" id="answer-${button + 1}" data-answer="${button + 1}">
            ${allAnswer[button].author.toUpperCase()}
          </button>`;
  });
  return buttons;
}
