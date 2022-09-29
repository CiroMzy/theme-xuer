
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

theme.debounce = function (func, wait, callback) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
      var result = func.apply(context, args)
      if (result.then) {
        result.then(res => {
          callback && callback(res)
        })
      } else {
        callback && callback(res)
      }
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};