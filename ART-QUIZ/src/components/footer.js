import Element from './element';

export default class Footer {
  constructor() {
    this.body = document.body;
    this.footer = new Element('footer', '', 'footer', '');
    this.wrapper = new Element('div', '', 'wrapper footer-wrapper', '');
    this.footerContent = new Element('div', '', 'footer-content', '');
    this.footerGithubLink = new Element('a', '', 'footer-github-link', 'VVK1978');
    this.footerYear = new Element('div', '', 'footer-year', '2021');
    this.footerSchoolLink = new Element('a', '', 'footer-school-link', '');
    this.footerLogo = new Element('div', '', 'footer-logo', '');
  }

  run() {
    if (!document.querySelector('.footer-wrapper')) {
      this.body.append(this.footer.render());

      this.footer = document.querySelector('.footer');
      this.footer.append(this.wrapper.render());

      this.wrapper = document.querySelector('.footer-wrapper');
      this.wrapper.append(this.footerContent.render());

      this.footerContent = document.querySelector('.footer-content');
      this.footerContent.append(this.footerGithubLink.render());
      this.footerContent.append(this.footerYear.render());
      this.footerContent.append(this.footerSchoolLink.render());

      this.footerGithubLink = document.querySelector('.footer-github-link');
      this.footerGithubLink.href = 'https://github.com/VVK1978';

      this.footerSchoolLink = document.querySelector('.footer-school-link');
      this.footerSchoolLink.href = 'https://rs.school/js/';
      this.footerSchoolLink.append(this.footerLogo.render());
    }
  }
}
