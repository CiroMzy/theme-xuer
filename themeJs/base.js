
var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
    this.$container = $(this);
    this.resizeEvt = null
    this.animateTime = 300
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  connectedCallback() {}
  disconnectedCallback() {
    this.removeResizeListener()
  }
  initSwiper(options = {}) {
    var $swiperContainers = $(this).find("[swiper]");
    var _this = this
    if ($swiperContainers.length) {
      $swiperContainers.each((idx, el) => {
        var $swiperContainer = $(el);
        var swiperId = $swiperContainer.attr("id");
        var datas = $swiperContainer.data() || {};
        var swiper = new Swiper(`#${swiperId}`, {
          loop: datas.swiperLoop || false,
          autoplay: datas.swiperAutoplay,
          speed: datas.swiperSpeed || 300,
          effect: datas.swiperEffect || "slide",
          navigation: {
            nextEl: `#${swiperId} .swiper-button-next`,
            prevEl: `#${swiperId} .swiper-button-prev`,
          },
          ...options,
        });
        _this.swiper = swiper
        theme.swipers[swiperId] = swiper;
      });
    }
  }
  changeClass(el, className, status, changeText) {
    if (status) {
      $(el).addClass(className);
      if (changeText) {
        $(el).html($(el).data("disableText"));
      }
    } else {
      $(el).removeClass(className);
      if (changeText) {
        $(el).html($(el).data("activeText"));
      }
    }
  }
  changeDisabled(el, disabled) {
    if (disabled) {
      $(el).attr("disabled", "disabled");
    } else {
      $(el).removeAttr("disabled");
    }
  }
  isDisable (el) {
    if ($(el).attr('loading') == "true") {
      return true
    }
    return false
  }
  setLoading(el) {
    $(el).attr('loading', true)
  }
  setUnLoading(el) {
    $(el).attr('loading', false)
  }
  getSectionHtml (sectionName) {
    return new Promise((resolve, reject) => {
      const url = `${theme.routes.root_url}`;
      theme.ajax
        .get(
          url,
          {
            sections: sectionName,
          },
          {
            headers: {
              accept: "*/*",
            },
          }
        )
        .then((res) => {
          resolve(res)
        });
    })
  }
  addResizeListener (fn) {
    const _this = this
    window.addEventListener('resize', function(event) {
      if (fn) {
        _this.resizeEvt = fn
        fn(event)
      }
    }, true);
  }
  removeResizeListener () {
    this.resizeEvt && window.removeEventListener('resize', this.resizeEvt)
  }
  animateOpacity (el, vis) {
    $(el).stop().animate({
      opacity: vis ? 1 : 0,
    }, this.animateTime);
  }
};

$(function() {
  $('[drawer-open]').click(function() {
    var type = $(this).data('action-type')      
    theme.drawer.open(type)
  })
})