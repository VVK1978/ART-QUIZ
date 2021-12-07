class Element {
  constructor(elementName, id, className, text) {
    this.container = document.createElement(`${elementName}`);
    if (id !== '') {
      this.container.id = id;
    }
    this.container.className = className;
    if (text !== '') {
      this.container.innerText = text;
    }
  }

  render() {
    return this.container;
  }
}

export default Element;
