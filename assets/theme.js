var Message = class {
  constructor() {
    this.datas = {};
    this.timer = null;
    this.init();
  }
  init() {
    var html = $("#xuer-message-tpl").html();
    $("body").append(html);
    this.$container = $("#xuer-message-container");
    this.datas = this.$container.find(".xuer-message-text").data();
  }

  loading(params = {}) {
    this.show({
      ...params,
      className: "loading",
      content: params.content | this.datas.loading,
    });
  }

  success(params = {}) {
    this.show({
      ...params,
      className: "success",
      content: params.content || this.datas.success,
    });
  }

  error(params = {}) {
    this.show({
      ...params,
      className: "success",
      content: params.content | this.datas.error,
    });
  }

  show({ content, className, timeout }) {
    this.$container.find(".xuer-message-text").html(content);
    this.$container.addClass(`${className} show`);
    this.timeoutHandler(timeout);
  }

  timeoutHandler(timeout = 3000) {
    this.timer && clearTimeout(this.timer);
    if (timeout === 0) {
      return;
    }
    this.timer = setTimeout(() => {
      this.hide();
    }, timeout);
  }
  hide() {
    this.$container.removeClass("loading show success error");
  }
};

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
  post: function (url, data, config={}) {
    return new Promise((resolve, reject) => {
      var { message=false, dataType = 'text', headers={} } = config
      console.log('headers', headers);
      $.ajax({
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "text/javascript",
          ...headers
        },
        type: "POST",
        url: url,
        data: data,
        dataType: dataType,
        success: function (data) {
          try{
            resolve(JSON.parse(data));
          } catch{
            resolve(data)
          }
          message && theme.message.success()
        },
        error: function (err) {
          reject(err);
          theme.message.error()
        },
      });
    });
  },
  get: function (url, params, config = {}) {
    var { dataType = 'text', headers={} } = config
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
        dataType,
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

theme.message = new Message()
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
};

$(function() {
  $('[drawer-open]').click(function() {
    var type = $(this).data('action-type')      
    theme.drawer.open(type)
  })
})

var Drawer = class extends BaseHTMLElement {
  connectedCallback () {
    theme.drawer = this
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
  open(type) {
    this.insertHtml(type)
    $(this).addClass('open')
    $(this).find('[drawer-main]').addClass(`open ${this.drawerType}`)
    $('body').addClass('lock')
  }
  close () {
    $('body').removeClass('lock')
    this.$container.removeClass(`open ${this.drawerType}`)
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

var AddressForm = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindEvents()
  }
  bindEvents () {
    var _this = this
    this.$container.find('form').on('submit', function (e) {
      e.preventDefault()
      var btn = _this.$container.find('.xuer-button')
      if (_this.isDisable(btn)) {
        return
      }
      var data = $(this).serializeObject()
      _this.setLoading(btn)

      var requestUrl = theme.routes.account_addresses_url
      var datas = _this.$container.data()
      if (datas.edit && datas.addressId) {
        requestUrl = `${requestUrl}/${datas.addressId}`
        data._method = 'put'
      }
      
      theme.ajax.post(requestUrl, data).then(res => {
        var html = $(res)
        var tpl = html.find('#add-address-tpl')
        var tplHtml = tpl.html()
        if (tplHtml.indexOf('xuer-form-error-msg') > -1) {
          $('[drawer-content]').html(tplHtml)
        } else {
          window.location.reload()
        }
      })
    })
  }
};
window.customElements.define("xuer-address-form", AddressForm);

var AddressList = class extends BaseHTMLElement {
  connectedCallback() {
    this.$addressTpl = $($('#add-address-tpl').html())
    this.bindEdit()
    this.bindDelete()
  }
  bindEdit () {
    this.$container.find('[address-edit]').click(function () {
      var id = $(this).data('addressId')
      if (!id) {
        return
      }
      theme.drawer.open(`add-address-tpl-${id}`)
    })
  }
  bindDelete () {
    var _this = this
    this.$container.find('[address-delete]').click(function () {
      var id = $(this).data('addressId')
      if (!id) {
        return
      }
      if (window.confirm(theme.language.delete_addresses_confirm)) {
        _this.onDelete(id)
      }
    })
  }
  onDelete (id) {
    theme.ajax.post(`${theme.routes.account_addresses_url}/${id}`, {
      _method: 'delete'
    }).then(() => {
      window.location.reload()
    })
  }
};
window.customElements.define("xuer-address-list", AddressList);

// AnnouncementBar
var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper({
      grabCursor : true,
    })
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);

var FeaturedProduct = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindForm();
  }
  bindForm() {
    this.forms = this.$container.find('[data-type="add-to-cart-form"]');
    this.$form = $(this.form);
    const _this = this
    this.forms.each(function (idx, form) {
      $(form).on("submit", function (e) {
        e.preventDefault();
        var data = $(this).serializeObject();
        if (!data.id) {
          return;
        }
        var $btn = _this.$container.find('[add-to-cart]')
        _this.setLoading($btn)
        theme.ajax
          .post(theme.routes.cart_add_url_js, {
            ...data,
            sections: "cart-drawer",
          }, {
            message: true
          })
          .then((res) => {
            theme.event.dispatch("resetCartCount");
          }).finally(() => {
            _this.setUnLoading($btn)
          });
      });
    });
  }
};
window.customElements.define("xuer-featured-product", FeaturedProduct);

$(function () {
  $('[drawer-open-localization]').click(function() {
      theme.drawer.open($(this).data('action-type'))
  })
})
var AddressSelect = class extends BaseHTMLElement {

  connectedCallback() {
    this.$country = $(this.$container.find('[country]'))
    this.$province = $(this.$container.find('[province]'))
    setTimeout(() => this.resetProvince())
    this.$country.find('select').on('change', () => {
      this.resetProvince()
    })
  }
  resetProvince () {
    this.countryValue = this.$country.find('select').val()
    this.provinceOptions = this.$country.find("option:selected").data("provinces")
    var selectedProvice = this.$province.find('select').data('value')
    if (this.provinceOptions.length) {
      var optionHtml = this.createProvinceOptions(this.provinceOptions, selectedProvice)
      this.$province.show().find('select').html(optionHtml)
    } else {
      this.$province.hide().find('select').html("")
    }
  }
  createProvinceOptions (list, selectedVal) {
    var str = ``
    list.forEach(pro => {
      var selected = selectedVal === pro[0] ? 'selected' : ''
      str += `<option value="${pro[0]}" ${selected}>${pro[1]}</option>`
    })
    return str
  }

};
window.customElements.define("xuer-form-address-select", AddressSelect);

// FormCheckbox
var FormCheckbox = class extends BaseHTMLElement {
  connectedCallback () {
    this.$input = $(this.$container.find('[xuer-input]'))
    this.bindChange()
  }
  bindChange () {
    this.$input.change(() => {
      var val = this.$input.is(':checked') ? 1 : 0
      this.$input.val(val)
    });
  }
};
window.customElements.define("xuer-form-checkbox", FormCheckbox);

// FormInput
var FormInput = class extends BaseHTMLElement {
  connectedCallback () {
    this.$input = $(this.$container.find('[xuer-input]'))
    this.focusClass = 'xuer-focus'
    this.bindChange()
    this.init()
  }
  init () {
    var val = this.getCurInputVal()
    this.troggleFocus(val)
  }
  bindChange () {
    var _this = this
    this.$input.bind("input propertychange",function(event){
      var val = _this.getCurInputVal()
      _this.troggleFocus(val)
    });
  }

  troggleFocus (val) {
    if (!val.length) {
      this.$input.removeClass(this.focusClass)
    } else {
      if (!this.$input.hasClass(this.focusClass)) {
        this.$input.addClass(this.focusClass)
      }
    }
  }

  getCurInputVal () {
    return this.$input.val()
  }
};
window.customElements.define("xuer-form-input", FormInput);

var FormSelect = class extends BaseHTMLElement {

  connectedCallback() {
    this.resetSelected()
  }
  resetSelected () {
    var value = this.$container.find('[xuer-select]').data('value')
    this.$container.find(`option[value='${value}']`).prop('selected', true)
  }
};
window.customElements.define("xuer-form-select", FormSelect);

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
        {
          headers: {
            accept: "*/*",
          },
        }
      )
      .then((res) => {
        $("#mini-cart-tpl").html(res);
        if (updateToDrawer) {
          $("[drawer-content]").html(res);
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
    this.cartChange({ quantity, el: e });
  }

  bindDelCart() {
    var _this = this;
    this.$container.find("[mini-cart-remove]").click(function () {
      _this.cartChange({ quantity: 0, el: this });
    });
  }

  cartChange({ quantity, el }) {
    var id = this.getProductItemId(el);
    var $parent = this.getProductItemId(el, true);
    var $img = $($parent.find("[xuer-image]"));
    $img.attr("loading", true);
    theme.ajax
      .post(theme.routes.cart_change_url, {
        id,
        quantity,
      })
      .then(() => {
        $img.attr("loading", false);
        theme.event.dispatch("resetCartCount", true);
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
			allowTouchMove: false,
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
			$addToCart.removeClass('disabled').find('[xuer-button-text]').html(theme.language.product_add_to_cart)	
		} else {
			$addToCart.addClass('disabled').find('[xuer-button-text]').html(theme.language.product_variant_no_stock)	
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


var DrawerSrarch = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindSearch()
    
  }
  searchProduct(val) {
    return new Promise(resolve => {
      if (!val) {
        resolve('')
        return
      }
      this.$container.find('[search-loading]').addClass('show')
      theme.ajax.get(theme.routes.predictive_search_url, {
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
      }, {
        headers: {
          'Content-Type': null,
          "accept": "text/html, */*; q=0.01"
        },
        dataType: 'html'
      }).then(res => {
        resolve(res)
      }).catch(() => {
        console.log('Error fetching results');
      }).finally(() => {
        this.$container.find('[search-loading]').removeClass('show')
      })
    })
  }

  bindSearch() {
    var _this = this
    this.debounceSearchProduct = theme.debounce(_this.searchProduct, 500, _this.insertSearchResult.bind(_this));
    console.log(this.$container.find('.search input'));
    this.$container.find('.search input').bind("input propertychange", function(){
      _this.$container.find('[drawer-loading]').addClass('show')
      _this.debounceSearchProduct($(this).val())
    })
  }

  insertSearchResult(res) {
    this.$container.find('[search-result]').html(res)
  }
 
};
window.customElements.define("xuer-drawer-search", DrawerSrarch);
