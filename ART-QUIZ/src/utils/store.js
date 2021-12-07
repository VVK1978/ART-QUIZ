/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-spacing */
let settings = {};
function initialSettingsData() {
  if (!JSON.parse(localStorage.getItem('settings'))) {
    settings = {
      isSound: true,
      volume: 0.2,
      isGameOnTime: false,
      time: 5,
      isFullScreen: false,
    };
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}

function getSettingsData() {
  return JSON.parse(localStorage.getItem('settings'));
}

function setSettingsData(key, value) {
  settings = JSON.parse(localStorage.getItem('settings'));
  settings[key] = value;
  localStorage.setItem('settings', JSON.stringify(settings));
}

function saveGameResults(result, state) {
  const resultsAll = JSON.parse(localStorage.getItem('results'));
  resultsAll[state.gameTitle][state.id] = result[state.id];
  resultsAll[state.gameTitle][state.id].isEnd = true;
  localStorage.setItem('results', JSON.stringify(resultsAll));
}

function getResult(state) {
  const result = JSON.parse(localStorage.getItem('results'));
  return result[state.gameTitle][state.id];
}

export {
  initialSettingsData, getSettingsData, setSettingsData, saveGameResults, getResult,
};
