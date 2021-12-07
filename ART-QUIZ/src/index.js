/* eslint-disable @babel/object-curly-spacing */
import '../public/asset/scss/base.scss';

import Main from './pages/main';
import Footer from './components/footer';
import initialStorage from './constants/initialstorage';
import { initialSettingsData } from './utils/store';

class App {
  constructor() {
    this.main = new Main();
    this.footer = new Footer();
    this.resultsAll = initialStorage;
    this.settings = initialSettingsData;
  }

  run() {
    this.main.run();
    this.footer.run();
    this.settings();
    this.initialStateStorage(this.resultsAll);
  }

  initialStateStorage(resultsAll) {
    this.resultsAll = resultsAll;
    if (!JSON.parse(localStorage.getItem('results'))) {
      localStorage.setItem('results', JSON.stringify(this.resultsAll));
    }
  }
}

const app = new App();
app.run();
