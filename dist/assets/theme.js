
var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
    this.$container = $(this)
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  disconnectedCallback() {
    if (this.curSlider && this.curSlider.disable) {
      this.curSlider.disable()
    }
  }
  initSwiper(options={}) {
    var swiperId = $(this).data('swiper-container')
    var swiperSelector = `#${swiperId}`
    var datas = $(swiperSelector).data()
    this.curSlider = new Swiper(`#${swiperId}`, {
      loop: datas.swiperLoop,
      autoplay: datas.swiperAutoplay,
      speed: datas.swiperSpeed || 300,
      effect: datas.swiperEffect || 'slide',
      ...options
    });
    if (datas.swiperDisable && this.curSlider.disable) {
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
// AnnouncementBar
var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper({
      grabCursor : true,
    })
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);

var Search = class{
  constructor(){
    this.$container = $('[drawer-content-wrapper]')
    this.init()
  }
  init () {
    this.bindSearch()
  }

  searchProduct(val) {
    return new Promise(resolve => {
      if (!val) {
        resolve('')
        return
      }
      $.ajax({
        url: theme.routes.predictive_search_url,
        data: {
          "q": val,
          "section_id": "predictive-search",
          "resources": {
            "type": "product",
            "limit": 10,
            "options": {
              "unavailable_products": "last",
              "fields": "title,body,product_type,variants.title,vendor"
            } 
          } 
        },
        dataType: 'html',
        success: function success(response) {
          resolve(response)
        },
        error: function error(response) {
          console.log('Error fetching results');
        } 
      });
    })
  }

  bindSearch() {
    var _this = this
    this.debounceSearchProduct = theme.debounce(_this.searchProduct, 500, _this.insertSearchResult.bind(_this));
    this.$container.find('.search').bind("input propertychange", function(){
      _this.$container.find('[drawer-loading]').addClass('show')
      _this.debounceSearchProduct($(this).val())
    })
  }

  insertSearchResult(res) {
    this.$container.find('[search-result]').html(res)
    this.$container.find('[drawer-loading]').removeClass('show')
  }
}


var Drawer = class extends BaseHTMLElement {
  connectedCallback () {
    theme.drawer = this
    this.searchTplId = 'search-tpl'
    this.$container = $(this)
    this.bindMouseEvent()
    this.controller = null
    
  }
  bindMouseEvent () {
    var _this = this
    this.$container.find('[action-close]').click(function() {
      _this.close()
    })
  }
  open(type, params) {
    switch(type) {
      case 'search':
        this.insertHtml(this.searchTplId)
        $(this).addClass('open')
        this.controller = new Search()
        break;
      case 'country':
        this.insertHtml('country-tpl')
        $(this).addClass('open')
        break;
      case 'language':
        this.insertHtml('language-tpl')
        $(this).addClass('open')
        break;
    }
    $(this).find('[drawer-main]').addClass('open')
    $('body').addClass('lock')
  }
  close () {
    $('body').removeClass('lock')
    this.$container.removeClass('open')
  }

  insertHtml (tplId) {
    var $con = $(`#${tplId}`)
    this.html = $con.html()
    this.title = $con.data('title')
    $(this).find('[drawer-content]').html(this.html)
    $(this).find('.title').html(this.title)
  }

 
};
window.customElements.define("xuer-drawer", Drawer);

var FeaturedProduct = class extends BaseHTMLElement {
  connectedCallback() {
  }
};
window.customElements.define("xuer-featured-product", FeaturedProduct);

$(function () {
  $('[drawer-open-localization]').click(function() {
      theme.drawer.open($(this).data('action-type'))
  })
})
var HeaderMenu = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()
  }
  bindMouseEvent () {
    $(this).find('.menu-level-1').hover(function() {
      $(this).addClass('open')
    }, function() {
      $(this).removeClass('open')
    })
  }

};
window.customElements.define("xuer-header-menu", HeaderMenu);


var Header = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()

  }
  bindMouseEvent () {
    $('[drawer-open]').click(function() {
      var type = $(this).data('action-type')      
      theme.drawer.open(type)
    })
  }
};
window.customElements.define("xuer-header", Header);

/*******
 * LocalizationForm
 */

var LocalizationForm = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()
  }
  bindMouseEvent () {
    var _this = this
    this.$container = $('[xuer-list-selector]')
    this.$container.find('.localization-select-item').click(function() {
      _this.resetChecked()
    })
  }
  resetChecked() {
    var val = $(this).find('input[name=language]:checked').val()
    this.$container.find('[xuer-list]').children().each(function(idx, el) {
      console.log($(this).data('value'), val);
      if ($(this).data('value') === val) {
        $(this).addClass('checked')
          .find('.xuer-radio-wrapper').addClass('xuer-radio-wrapper-checked')
      } else {
        $(this).removeClass('checked')
          .find('.xuer-radio-wrapper').removeClass('xuer-radio-wrapper-checked')
      }
    })
    this.$container.find('[name=locale_code]').val(val)


  }
};
window.customElements.define("xuer-localization-form", LocalizationForm);

// product-slide
var ProductSlide = class extends BaseHTMLElement {
  connectedCallback () {
    if (this.$container.is('[use-slide]')) {
      this.initSwiper()
    }
  }
  initSwiper () {
    var mainId = this.$container.find('[swiper-main]').attr('id')
    var thumbnailId = this.$container.find('[swiper-thumbnail]').attr('id')

    var swiperThumb = new Swiper(`#${thumbnailId}`, {
      spaceBetween: 10,
      slidesPerView: 4,
      watchSlidesProgress: true,
    });
    new Swiper(`#${mainId}`, {
      spaceBetween: 10,
      autoHeight: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: swiperThumb,
      },
    });
  }
};
window.customElements.define("xuer-product-slide", ProductSlide);

var Slideshow = class extends BaseHTMLElement {
  connectedCallback() {
    var slides,imgBox,imgPrev,imgActive,derection
    var lock = false
		var imageBoxSelector = '.slideshow-image'
		var imageSelector = 'img'
    
    this.initSwiper({
			speed: 1300,
			parallax: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				transitionStart: function () {
					lock = true; //锁住按钮
					slides = this.slides
					imgBox = slides.eq(this.previousIndex).find(imageBoxSelector)
					imgPrev = slides.eq(this.previousIndex).find(imageSelector)
					imgActive = slides.eq(this.activeIndex).find(imageSelector)
					derection = this.activeIndex - this.previousIndex
					var $activeSlide = $(slides.eq(this.activeIndex))
					var slideBgColor= $activeSlide.data('background-color')
					this.$el.css("background-color", slideBgColor);
					imgBox.transform('matrix(0.6, 0, 0, 0.6, 0, 0)');
					imgPrev.transition(1000).transform('matrix(1.2, 0, 0, 1.2, 0, 0)'); //图片缩放视差
					this.slides.eq(this.previousIndex).find('.text').transition(1000).css('color', 'rgba(255,255,255,0)'); //文字透明动画

					imgPrev.transitionEnd(function () {
						imgActive.transition(1300).transform('translate3d(0, 0, 0) matrix(1.2, 0, 0, 1.2, 0, 0)'); //图片位移视差
						imgPrev.transition(1300).transform('translate3d(' + 60 * derection +
							'%, 0, 0)  matrix(1.2, 0, 0, 1.2, 0, 0)');
					});
				},
				transitionEnd: function () {
					this.slides.eq(this.activeIndex).find(imageBoxSelector).transform(' matrix(1, 0, 0, 1, 0, 0)');
					var $activeSlide = $(this.slides.eq(this.activeIndex))
					var textColor = $activeSlide.data('text-color')
					imgActive = this.slides.eq(this.activeIndex).find(imageSelector)
					imgActive.transition(1000).transform(' matrix(1, 0, 0, 1, 0, 0)');
					this.slides.eq(this.activeIndex).find('.text').transition(1000).css('color', textColor);

					imgActive.transitionEnd(function () {
						lock = false
					});
				},
				init: function () {
					this.emit('transitionEnd'); //在初始化时触发一次transitionEnd事件
				},

			}
		});
  }
};
window.customElements.define("xuer-slideshow", Slideshow);

