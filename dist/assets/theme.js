theme.swipers = {};
theme.event = {
  miniCartCountChange: null,
  dispatch: function (key, params) {
    if (!theme.event[key]) return
    var evt = theme.event[key]
    if (Array.isArray(evt)) {
      evt.forEach(fn => {
        fn && fn(params)
      })
    } else {
      evt && evt(params)
    }
  },
};
theme.ajax = {
  post: function (url, data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "text/javascript",
        },
        type: "POST",
        url: url,
        data: data,
        dataType: "text",
        success: function (data) {
          resolve(JSON.parse(data));
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  },
  get: function (url, params, headers = {}, oterConfig = {}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "text/javascript",
          ...headers,
        },
        type: "GET",
        url: url,
        data: params,
        dataType: "text",
        ...oterConfig,
        success: function (data) {
          var res = null
          try{
            res = JSON.parse(data)
          } catch(e) {
            res = data
          }
          resolve(res)
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  },
};

theme.message = {
  info: function ({message}) {
    window.alert(message)

  }
}

$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

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
          ...options,
        });
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
};

theme.debounce = function (func, wait, callback) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      var result = func.apply(context, args);
      if (result.then) {
        result.then((res) => {
          callback && callback(res);
        });
      } else {
        callback && callback(res);
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
      case 'min-cart':
        this.insertHtml('mini-cart-tpl')
        $(this).addClass('open')
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
    this.bindForm()
  }
  bindForm () {
    this.forms = this.$container.find('[data-type="add-to-cart-form"]')
    this.$form = $(this.form)
    
    this.forms.each(function (idx,form) {
      $(form).on('submit', function (e) {
        e.preventDefault()
        var data = $(this).serializeObject()
        if (!data.id) {
          return
        }
        theme.ajax.post(theme.routes.cart_add_url_js, {
          ...data,
          // quantity: "1",
          sections: "cart-drawer"
        }).then(res => {
          console.log('res', res);
          theme.event.dispatch('resetCartCount')
        })


      })
    })
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

var MiniCartIcon = class extends BaseHTMLElement {
  connectedCallback() {
    theme.event.resetCartCount = this.resetCartCount.bind(this);
    this.resetCartCount();
  }
  resetCartCount(updateToDrawer) {
    theme.ajax.get(theme.routes.cart_url_js).then((cart) => {
      this.$container.find(".min-cart-count").html(cart.item_count);
      if (!cart.items.length) return;
      var product = cart.items[0];
      this.setCartHtml(product.product_id, updateToDrawer);
    });
  }
  setCartHtml(productId, updateToDrawer) {
    const url = `${theme.routes.product_recommendations_url}`;
    theme.ajax
      .get(
        url,
        {
          product_id: productId,
          limit: 10,
          section_id: "mini-cart",
        },
        { accept: "*/*" }
      )
      .then((res) => {
        $("#mini-cart-tpl").html(res);
        if (updateToDrawer) {
          $('[drawer-content]').html(res)
        }
      });
  }
};

var MiniCart = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindDelCart();
    theme.event.miniCartCountChange = this.quantityChange.bind(this);
  }

  getProductItemId(el, getDom) {
    if (getDom) {
      return $(el).parents("[mini-product-item]");
    }
    return $(el).parents("[mini-product-item]").data("cartId");
  }

  quantityChange({ quantity, e }) {
    this.cartChange({ quantity, el: e })
  }

  bindDelCart() {
    var _this = this;
    this.$container.find("[mini-cart-remove]").click(function () {
      _this.cartChange({ quantity: 0, el: this });
    });
  }

  cartChange({ quantity, el }) {
    var id = this.getProductItemId(el);
    var $parent = this.getProductItemId(el, true)
    var $img = $($parent.find('[xuer-image]'))
    $img.attr('loading', true)
    theme.ajax
      .post(theme.routes.cart_change_url, {
        id,
        quantity,
      })
      .then(() => {
        $img.attr('loading', false)
        theme.event.dispatch('resetCartCount', true)
      });
  }
};

window.customElements.define("xuer-mini-cart", MiniCart);
window.customElements.define("xuer-mini-cart-icon", MiniCartIcon);

// product-slide
var ProductSlide = class extends BaseHTMLElement {
  connectedCallback () {
    if (this.$container.is('[use-slide]')) {
      this.initSwiper()
      this.bindSlideEvents()
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

    var swiperMain = new Swiper(`#${mainId}`, {
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

    theme.swipers[thumbnailId] = swiperThumb
    this.swiperThumb = swiperThumb
    this.swiperMain = swiperMain
  }
  slideToIndex (index) {
    this.swiperThumb.slideTo(index)
    this.swiperMain.slideTo(index)
  }
  bindSlideEvents () {
    theme.event[`product-slide-${this.dataset.sectionId}`] = this.slideToIndex.bind(this)
  }
};
window.customElements.define("xuer-product-slide", ProductSlide);

var QuantitySelector = class extends BaseHTMLElement {
  connectedCallback() {
    this.$input = $(this.$container.find('input'))
    this.bindInputEvents();
    this.bindButtons()
  }
  bindInputEvents() {
    var _this = this
    this.$input.bind("input propertychange",function(event){
      var val = _this.getCurInputVal()
      _this.setInputVal(val)
    });

    this.$input.on('change', function () {
      var val = _this.getCurInputVal()
      if (!val) {
        _this.setInputVal(1)
      }
    })
  }

  bindButtons () {
    var _this = this
    this.$container.find('.quantity_min').click(function() {
      var val = _this.getCurInputVal()
      var newVal = --val
      _this.setInputVal(Math.max(newVal, 1))
    })

    this.$container.find('.quantity_plus').click(function() {
      var val = _this.getCurInputVal()
      var max = _this.$input.attr('max')
      var newVal = ++val
      
      if (max && !isNaN(max) && (newVal > max)) {
        newVal = max
      }
      _this.setInputVal(newVal)
    })
  }

  setInputVal (val) {
    this.$input.val(val)
    this.$input.attr('size', `${val}`.length)
    if (this.$container.data('trigger') === 'mini-cart') {
      theme.event.dispatch('miniCartCountChange', {
        e: this.$input,
        quantity: val
      })
    }
  }

  getCurInputVal () {
    var val = this.$input.val()
    if (!val) {
      val = 1
    }
    var num = /^\d{0,}$/
    if (!num.test(val)) {
      var val = val.replace(/\D/g, '')
    }
    return Number(val)
  }


};
window.customElements.define("xuer-quantity-selector", QuantitySelector);

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


var VariantPicker = class extends BaseHTMLElement {
  constructor() {
    super();
    this.selectedOptions = null;
    this.variantData = null;
  }
  connectedCallback() {
    var _this = this;
		_this.variantChange()
    $("[picker-button]").click(function () {
      setTimeout(() => _this.variantChange());
    });
  }

  variantChange() {
    this.selectedOptions = this.getSelectedOptions();
    this.variantData = this.getVariantData();
    this.selectedVariant = this.getSelectedVariant();
    this.setVariantStatus();
		this.setAddToCartStatus()
    this.setActiveMedia();
    this.setActiveUrl();
  }

  getSelectedOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    return fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }

  getVariantData() {
    return (
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent)
    );
  }

  getSelectedVariant() {
    return this.variantData.find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.selectedOptions[index] === option;
        })
        .includes(false);
    });
  }

  setVariantStatus() {
    var _this = this;
		var deeps = []
    this.$container.find(".xuer-option-item_fieldset").each(function (idx, el) {
			var name = this.dataset.checkboxName
			var value = $(`input[name='${name}']:checked`).val()
			deeps.push({
				key:`option${idx+1}`, value
			})
      $(el).find(".xuer-option-item_input").each(function (i, e) {
          var val = $(e).val();
          const hasAvailable = _this.variantData.some(
            (variant) => {
							let hit = deeps.every(({key, value}, idx) => {
								var curVal = value
								if (idx === deeps.length - 1) {
									curVal = val
								}
								return variant[key] === curVal && variant.available
							})
							return hit
						}
          );

          _this.setClassToVariant({ el: e, hasAvailable });
        });
    });
  }

	setAddToCartStatus () {
		var $addToCart = $(`#${this.dataset.sectionId}`).find('[add-to-cart]')
		if (this.selectedVariant.available) {
			$addToCart.removeClass('disabled').html(theme.language.product_add_to_cart)	
		} else {
			$addToCart.addClass('disabled').html(theme.language.product_variant_no_stock)	
		}
		var $value = $($addToCart.parent().siblings('[name="id"]'))
		$value.val(this.selectedVariant.id)
		this.changeDisabled($value, !this.selectedVariant.available)
	}

  setClassToVariant({ el, hasAvailable }) {
		this.changeClass(el, 'disabled', !hasAvailable)
  }

  setActiveMedia() {
    if (!this.selectedVariant || !this.selectedVariant.featured_media) return;

    this.mediaId = `${this.dataset.sectionId}-${this.selectedVariant.featured_media.id}`;

    var newMedia = document.querySelector(`[data-media-id="${this.mediaId}"]`);
    if (!newMedia) return;

    var slideIndex = $(newMedia).parent().find(".swiper-slide").index(newMedia);
    theme.event[`product-slide-${this.dataset.sectionId}`](slideIndex);
  }

  setActiveUrl() {
    if (!this.selectedVariant || this.dataset.updateUrl === "false") return;
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.selectedVariant.id}`
    );
  }
};
window.customElements.define("xuer-variant-picker", VariantPicker);
