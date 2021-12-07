/* eslint-disable import/no-cycle */
/* eslint-disable @babel/object-curly-spacing */
import Element from '../components/element';
import Main from './main';
import closeThisPage from '../utils/close-page';
import { setSettingsData, getSettingsData } from '../utils/store';
import footerHidden from '../utils/footer-hidden';
import {
  SETTING_OPEN_TIME,
  TIME_ANIMATION,
} from '../constants/game-constants';

export default class Settings {
  constructor() {
    this.section = new Element('section', '', 'settings', '');
    this.backArrow = new Element('div', 'back-to-main', 'back settings-to-main', '');
    this.settingsHead = new Element('div', '', 'settings-head', '');
    this.settingsBody = new Element('div', '', 'settings-body', '');
    this.settingsTitle = new Element('h2', '', 'settings-title', 'Настройки игры');
    this.settingsContainer = new Element('div', '', 'settings-container', '');
    this.soundLabel = new Element('label', '', 'sound-label', 'Звук вкл/выкл');
    this.soundCheckbox = new Element('input', 'sound', 'sound-checkbox', '');
    this.volumeLabel = new Element('label', '', 'volume-label', 'Громкость');
    this.volumeRange = new Element('input', 'volume', 'volume-range', '');
    this.timeLabel = new Element('label', '', 'time-label', 'Играть на время');
    this.timeCheckbox = new Element('input', 'time', 'time-checkbox', '');
    this.timeRange = new Element('input', 'time-range', 'time-range', '');
    this.timeValue = new Element('div', 'time-value', 'time-value', '');
    this.screenLabel = new Element('label', '', 'screen-label', 'Полноэкранный режим');
    this.screenCheckbox = new Element('input', 'screen-mode', 'screen-checkbox', '');
  }

  run() {
    this.wrapper = document.querySelector('.wrapper');
    this.wrapper.append(this.section.render());
    this.section = document.querySelector('.settings');
    this.section.append(this.settingsHead.render());
    this.settingsHead = document.querySelector('.settings-head');
    this.settingsHead.append(this.backArrow.render());
    this.section.append(this.settingsBody.render());
    this.settingsBody = document.querySelector('.settings-body');
    this.settingsBody.append(this.settingsTitle.render());
    this.settingsBody.append(this.settingsContainer.render());
    setTimeout(() => {
      this.section.classList.add('active');
    }, SETTING_OPEN_TIME);
    this.settings();
    footerHidden();
  }

  settings() {
    const settings = getSettingsData();
    this.settingsContainer = document.querySelector('.settings-container');
    this.settingsContainer.append(this.soundLabel.render());

    const soundLabel = document.querySelector('.sound-label');
    soundLabel.setAttribute('for', 'sound');
    soundLabel.append(this.soundCheckbox.render());

    const soundCheckbox = document.querySelector('.sound-checkbox');
    soundCheckbox.setAttribute('type', 'checkbox');
    soundCheckbox.checked = settings.isSound;

    this.settingsContainer.append(this.volumeLabel.render());
    const volumeLabel = document.querySelector('.volume-label');
    volumeLabel.setAttribute('for', 'volume');
    volumeLabel.append(this.volumeRange.render());

    const volumeRange = document.querySelector('.volume-range');
    if (!settings.isSound) {
      volumeRange.setAttribute('disabled', 'true');
    }
    volumeRange.setAttribute('type', 'range');
    volumeRange.setAttribute('min', '0');
    volumeRange.setAttribute('max', '100');
    volumeRange.setAttribute('value', `${settings.volume * 100}`);
    volumeRange.setAttribute('step', '10');

    this.settingsContainer.append(this.timeLabel.render());
    const timeLabel = document.querySelector('.time-label');
    timeLabel.setAttribute('for', 'time');
    timeLabel.append(this.timeCheckbox.render());

    const timeCheckbox = document.querySelector('.time-checkbox');
    timeCheckbox.setAttribute('type', 'checkbox');
    timeCheckbox.checked = settings.isGameOnTime;

    this.settingsContainer.append(this.timeRange.render());
    const timeRange = document.querySelector('.time-range');

    timeRange.setAttribute('type', 'range');
    timeRange.setAttribute('min', '5');
    timeRange.setAttribute('max', '30');
    timeRange.setAttribute('value', `${settings.time}`);
    timeRange.setAttribute('step', '5');
    timeRange.setAttribute('disabled', `${settings.isGameOnTime}`);
    if (settings.isGameOnTime) {
      timeRange.removeAttribute('disabled');
    }

    this.settingsContainer.append(this.timeValue.render());
    const timeValue = document.querySelector('.time-value');
    timeValue.textContent = `${settings.time} секунд`;

    this.settingsContainer.append(this.screenLabel.render());
    const screenLabel = document.querySelector('.screen-label');
    screenLabel.append(this.screenCheckbox.render());
    const screenCheckbox = document.querySelector('.screen-checkbox');
    screenCheckbox.setAttribute('type', 'checkbox');

    this.handleClick();
  }

  setFullScreenMode() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch();
    }
    return this;
  }

  handleClick() {
    this.settingsContainer.addEventListener('input', (event) => {
      this.settingsEvents(event);
    });
    if (document.querySelector('.settings-to-main')) {
      this.backArrow = document.querySelector('.settings-to-main');
      this.backArrow.addEventListener('click', () => {
        if (document.querySelector('.settings')) {
          this.section = document.querySelector('.settings');
          this.section.classList.remove('active');
        }
        closeThisPage(TIME_ANIMATION);
        setTimeout(() => {
          new Main().run();
          this.footer = document.querySelector('.footer');
          this.footer.classList.remove('hidden');
        }, TIME_ANIMATION);
      });
    }
  }

  settingsEvents(event) {
    const { target } = event;

    this.timeValue = document.querySelector('.time-value');

    if (target.id === 'sound') {
      setSettingsData('isSound', target.checked);
      this.volumeRange = document.querySelector('.volume-range');
      if (target.checked) {
        this.volumeRange.removeAttribute('disabled');
        setSettingsData('volume', this.volumeRange.value / 100);
      } else {
        this.volumeRange.setAttribute('disabled', 'true');
        setSettingsData('volume', 0);
      }
    }

    if (target.id === 'time') {
      setSettingsData('isGameOnTime', target.checked);
      this.timeRange = document.querySelector('.time-range');
      if (target.checked) {
        this.timeRange.removeAttribute('disabled');
      } else {
        this.timeRange.setAttribute('disabled', 'true');
      }
    }

    if (target.id === 'volume') {
      setSettingsData('volume', target.value / 100);
    }

    if (target.id === 'time-range') {
      setSettingsData('time', target.value);
      this.timeValue.textContent = `${target.value} секунд`;
    }

    if (target.id === 'screen-mode') {
      const isFullScreen = target.checked;
      this.setFullScreenMode();
      setSettingsData('isFullScreen', isFullScreen);
    }
  }
}
