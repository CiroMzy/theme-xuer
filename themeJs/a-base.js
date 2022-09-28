
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
    var swiperId = $(this).data('swiper-container')
    var swiperSelector = `#${swiperId}`
    var datas = $(swiperSelector).data()
    this.curSlider = new Swiper(`#${swiperId}`, {
      loop: 'true',
      autoplay:true,
      ...options
    });
    if (datas.swiperDisable) {
      this.curSlider.disable()
    }
  }
};
