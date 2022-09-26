var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  disconnectedCallback() {}
  getData(key) {
    return $(this).data(key)
  }
};

var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    const swiperId = this.getData('swiper-container-id')
    this.curSlider = new Swiper(`#${swiperId}`, {
      loop: 'true',
      direction : 'vertical',
      effect: "fade",
      autoplay:true,
    });
  }
  disconnectedCallback() {
    this.curSlider && this.curSlider.disable()
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);
