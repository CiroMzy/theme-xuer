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
  initSwiper(options={}) {
    const swiperId = $(this).data('swiper-container')
    const swiperSelector = `#${swiperId}`
    const datas = $(swiperSelector).data()
    console.log('datas', datas);
    this.curSlider = new Swiper(`#${swiperId}`, {
      loop: 'true',
      autoplay:true,
      ...options
    });
    if (datas.swiperDisable) {
      this.curSlider.disable()
    }
  }
  getData(key) {
    
  }
};

var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper({
      grabCursor : true,
    })
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);

var Slideshow = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper()
  }
};
window.customElements.define("xuer-slideshow", Slideshow);