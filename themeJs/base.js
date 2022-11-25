
var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
    this.$container = $(this);
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  disconnectedCallback() {}
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
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
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
};

$(function() {
  $('[drawer-open]').click(function() {
    var type = $(this).data('action-type')      
    theme.drawer.open(type)
  })
})