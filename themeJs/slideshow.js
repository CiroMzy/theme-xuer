
var Slideshow = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper()
  }
};
window.customElements.define("xuer-slideshow", Slideshow);
