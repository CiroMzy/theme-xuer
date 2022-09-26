var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  disconnectedCallback() {
    if (this.curSlider) {
      this.curSlider.disable()
    }
  }
  initSlide(options={}) {
    const swiperId = this.getData('swiper-container')
    this.curSlider = new Swiper(`#${swiperId}`, {
      loop: 'true',
      autoplay:true,
      ...options
    });
  }
  getData(key) {
    return $(this).data(key)
  }
};

var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSlide({
      grabCursor : true,
    })
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);

var Slideshow = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSlide()
  }
};
window.customElements.define("xuer-slideshow", Slideshow);