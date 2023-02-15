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
  priceRangeChange: null,
  formChange: null,
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
  }
};

theme.debounce = function (func, wait = 800, callback) {
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
theme.initAnimate = function () {
  var finishedClass = 'xuer-finished'
  var defaultAnimateClass = 'xuer-animate_fadeInUp'
  if (window.innerWidth >= 768) {
    if ("IntersectionObserver" in window) {
      var intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !entry.target.classList.contains(finishedClass)
            ) {
              setTimeout(() => {
                let $target = $(entry.target)
                let animateClass = $target.attr('xuer-animated') || defaultAnimateClass
                $(entry.target).addClass(animateClass)
              }, 200);
              observer.unobserve(entry.target);
            }
          });
        }
      );
      $(`[xuer-animated]:not(.${finishedClass})`).each((idx, el) => {
          intersectionObserver.observe(el);
      })
    } else {
      $(`[xuer-animated]:not(.${finishedClass})`).each((idx, el) => {
          $(el).addClass(`${finishedClass} ${defaultAnimateClass}`)
      })
    }
  }
};
theme.initAnimate()
document.addEventListener('shopify:section:load', () => {
  debugger
  theme.initAnimate()
});

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
        var opt = {
          loop: datas.swiperLoop || false,
          autoplay: datas.swiperAutoplay,
          speed: datas.swiperSpeed || 300,
          effect: datas.swiperEffect || "slide",
          navigation: {
            nextEl: `#${swiperId} .swiper-button-next`,
            prevEl: `#${swiperId} .swiper-button-prev`,
          },
          ...options,
        }
        console.log('opt', opt)
        var swiper = new Swiper(`#${swiperId}`, opt);
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
  async loadPage (href) {
    // const response = await fetch(href);
    triggerNonBubblingEvent(this, "openable-element:load:start");
    const response = await fetch(this.getAttribute("href"));
    const element = document.createElement("div");
    element.innerHTML = await response.text();
    this.innerHTML = element.querySelector(this.tagName.toLowerCase()).innerHTML;
    this.removeAttribute("href");
    triggerNonBubblingEvent(this, "openable-element:load:end");
  }
};

$(function() {
  $('[drawer-open]').click(function() {
    var type = $(this).data('action-type')      
    theme.drawer.open(type)
  })
})

var Collapse = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindEvents()
  }
  bindEvents () {
    this.$container.find('[xuer-collapse-item]').each(function(idx, el) {
      var $item = $(el)
      if ($item.hasClass('open')) {
        var initHeight = $item.find('[xuer-collapse-content]').outerHeight()
        $item.find('[xuer-collapse-main]').height(initHeight)
      }
      
      $(el).find('[xuer-collapse-title]').click(function () {
        if ($item.hasClass('open')) {
          $item.find('[xuer-collapse-main]').height(0)
          $item.find('[xuer-collapse-content]').removeClass('xuer-animate_fadeInUp')
          $item.removeClass('open')
        } else {
          var height = $item.find('[xuer-collapse-content]').outerHeight()
          $item.find('[xuer-collapse-main]').height(height)
          $item.find('[xuer-collapse-content]').addClass('xuer-animate_fadeInUp')
          $item.addClass('open')
        }
      })
    })
    
  }

};

window.customElements.define("xuer-collapse", Collapse);


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
    $(this).find('[drawer-content]').addClass('xuer-animate_fadeInUp')
    $('body').addClass('lock')
  }
  close () {
    $('body').removeClass('lock')
    this.$container.removeClass(`open ${this.drawerType}`)
    this.$container.find('[drawer-content]').removeClass('xuer-animate_fadeInUp')
    
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

/*******
 * PriceRange
 */

var PriceRange = class extends BaseHTMLElement {
  connectedCallback () {
    this.datas = this.$container.data()
    this.debounceUpdate = theme.debounce(this.debounceUpdateHandler);
    this.bindMouseEvent()
  }
  bindMouseEvent () {
    $('.range-slider').jRange({
      from: this.datas.rangeStart,
      to: this.datas.rangeEnd,
      step: 1,
      scale: [],
      format: '%s',
      width: 280,
      showLabels: false,
      showScale: false,
      isRange : true,
      ondragend: this.onPriceChange.bind(this)
    });
  }
  onPriceChange (e) {
    var prices = e.split(',')
    this.startPrice = prices[0]
    this.endPrice = prices[1]
    this.$container.find('.price-start').html(this.startPrice)
    this.$container.find('[price_gte]').val(this.startPrice)
    this.$container.find('.price-end').html(this.endPrice)
    this.$container.find('[price_lte]').val(this.endPrice)
    this.debounceUpdate({startPrice:this.startPrice, endPrice:this.endPrice })
    
  }
  debounceUpdateHandler (params) {
    return new Promise(resolve => {
      theme.event.dispatch("formChange");
      resolve()
    })
  }
};
window.customElements.define("xuer-price-range", PriceRange);

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

/*******
 * product-filters
 */

var ProductFilters = class extends BaseHTMLElement {
  connectedCallback() {
    this.sectionId = this.$container.data("sectionId");
    theme.event.formChange = this.updatePageFilters.bind(this)
  }
  updatePageFilters() {
    var formData = this.getFormData();
    var searchParamsAsString = new URLSearchParams(formData).toString();
    var href = `${window.location.pathname}?${searchParamsAsString}`;
    history.replaceState({}, "", href);
    this.getCollectionPage(`${href}&section_id=${this.sectionId}`).then(
      (html) => {
        this.resetHtmlToDom(html)
      }
    );
  }
  resetHtmlToDom (html) {
    var $resultHtml = $(html)
    var mainHtml = $resultHtml.find('[collection-main]').html()
    var $main = $('[collection-main]')
    $main.html(mainHtml)
    // var $asideHtml = $($resultHtml.find('[collection-aside]').html())
    // var $aside = $('[collection-aside]')
    // $aside.find('[xuer-collapse-item]').each((i, el) => {
    //   var $elTarget = $asideHtml.find('[xuer-collapse-item]').eq(i)
    //   if ($(el).hasClass('open')) {
    //     $elTarget.addClass('open')
    //   } else {
    //     $elTarget.removeClass('open')
    //   }
    // })
    // $aside.html($asideHtml)
  }
  getFormData() {
    const formEl = this.$container.find("[product-filters-form]");
    const formData = new FormData(formEl[0]);
    formData.append("sort_by", "best-selling");
    return formData;
  }

  getCollectionPage(href) {
    return new Promise((resolve) => {
      theme.ajax
        .get(href, {}, { headers: { accept: "*/*" } })
        .then((res) => {
          resolve(res);
        });
    });
  }
};
window.customElements.define("xuer-product-filters", ProductFilters);

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
    this.$input = $(this.$container.find('[xuer-checkbox]'))
    this.changeValue = this.$container.attr('change_value')
    this.bindChange()  
  }
  bindChange () {
    this.$input.change(() => {
      theme.event.dispatch("formChange");
      if (this.changeValue == 'true') {
        var val = this.$input.is(':checked') ? 1 : 0
        this.$input.val(val)
      }
    });
  }
};
window.customElements.define("xuer-form-checkbox", FormCheckbox);

// FormInput
var FormInput = class extends BaseHTMLElement {
  connectedCallback () {
    this.isTextarea = this.$container.hasClass('is_textarea')
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
    return this.$input.val() === undefined ? '' : this.$input.val()
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
  }
  resetCartCount(updateToDrawer) {
    theme.ajax.get(theme.routes.cart_url_js).then((cart) => {
      this.$container.find(".min-cart-count").html(cart.item_count);
      this.getSectionHtml("mini-cart").then(res => {
        const mini_cart_html = res['mini-cart']
        $("#mini-cart-tpl").html(mini_cart_html);
        if (updateToDrawer) {
          $("[drawer-content]").html(mini_cart_html);
        }
      })
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
    this.debounceUpdate = theme.debounce(this.debounceUpdateHandler);
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
      this.debounceUpdate({
        e: this.$input,
        quantity: val
      })
    }
  }

  debounceUpdateHandler (params) {
    return new Promise(resolve => {
      theme.event.dispatch('miniCartCountChange', params)
      resolve()
    })
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
		const _this = this
		this.cacheIndex = 0
		this.datas = this.$container.find('[swiper]').data()
		let options = {}
		switch (this.datas.swiperSlideType) {
			case 'fade':
				options = {
					effect: 'fade'
				}
				break
			case 'sweep':
				options = {
					grabCursor: true,
					effect: "creative",
					autoplay: true,
					loop: true,
					creativeEffect: {
						prev: {
							shadow: true,
							translate: ["-20%", 0, -1],
						},
						next: {
							translate: ["100%", 0, 0],
						},
					}
				}
				break
			case 'slide':
				options = {}
				break;
		}


    this.initSwiper({
			...options,
			pagination: {
				el: ".swiper-pagination",
			},
			speed: _this.datas.swiperSpeed,
			on: {
				init: function () {
					_this._slides = this.slides
					_this.slideShow(0)
				},
				slideChangeTransitionStart: function () {
					if (!_this._slides) {
						_this._slides = this.slides
					}
					_this.slideHide(this.activeIndex)
				},
				slideChangeTransitionEnd: function () {
					if (!_this._slides) {
						_this._slides = this.slides
					}
					_this.slideShow(this.activeIndex)
				},
			}
		});
  }
	slideShow (idx) {
		const $activeSlider = this._slides.eq(idx)
		this.$animateItem = $activeSlider.find(".slide-animate").addClass(`xuer-animated xuer-animate__${this.datas.swiperTextType}`)
	}
	slideHide (idx) {
		const $activeSlider = this._slides.eq(this.cacheIndex)
		this.$animateItem = $activeSlider.find(".slide-animate").removeClass(`xuer-animated xuer-animate__${this.datas.swiperTextType}`)
		this.cacheIndex = idx
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
    this.$searchLoading = $(this.$container.find('[search-loading]'))
    this.$searchResult = this.$container.find('.search-suggest-result')
    this.$searchCollection = this.$container.find('.search-collection')
    this.searchType = this.$container.data('search_type')
    this.bindSearch()
  }
  searchProduct(val) {
    return new Promise(resolve => {
      if (!val) {
        resolve('')
        return
      }
      this.startLoad()
      theme.ajax.get(theme.routes.predictive_search_url, {
        "q": val,
        "section_id": "predictive-search",
        "resources": {
          "type": this.searchType,
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
    this.debounceSearchProduct = theme.debounce(_this.searchProduct, 800, _this.insertSearchResult.bind(_this));
    this.$container.find('.search input').bind("input propertychange", function(){
      const _val = $(this).val()
      if (_val === '') {
        _this.reset()
        return
      }
      _this.startLoad()
      _this.debounceSearchProduct(_val)
    })
  }
  reset () {
    this.$searchLoading.removeClass('show')
    this.$searchResult.html('').removeClass('show')
  }
  startLoad () {
    this.$searchLoading.addClass('show')
    this.$searchResult.html('').removeClass('show')
    this.$searchCollection.html('')
  }

  insertSearchResult(res) {
    var _result = $(res).find('.search-suggest-result').html()
    this.$searchResult.html(_result).addClass('show')
  }
 
};
window.customElements.define("xuer-drawer-search", DrawerSrarch);

/*******
 * product-item
 */

var ProductItem = class extends BaseHTMLElement {
  connectedCallback () {
    this.$imageWrapper = this.$container.find('.product-image-wrapper')
    this.bindHover()
    this.bindVariantChange()
  }
  bindHover () {
    this.$hoverImage = this.$imageWrapper.find('.product-image_hover')
    const _this = this
    this.$imageWrapper.hover(function () {
      _this.$hoverImage.addClass('xuer-active')
      _this.$container.find('.quick-buy-button').addClass('xuer-active')
    }, function () {
      _this.$hoverImage.removeClass('xuer-active')
      _this.$container.find('.quick-buy-button').removeClass('xuer-active')
    })
  }
  bindVariantChange () {
    const _this = this
    
    this.$container.find('.xuer-color-swatch_item').each(function(idx, el) {
      const name = $(el).data('name')
      const inbox = _this.$container.find('.xuer-color-swatch').data('inbox')
      $(this).find(`input[type=radio][name=${name}]`).change(function (e) {
        const mediaId = $(e.target).data('media')
        const $switch = _this.$container.find('.product-image_switch')
        const variantId = $(e.target).data('variantId')
        
        _this.$container.find('.product-image_default').css('opacity', 0)
        $switch.find(`.xuer-pre-active`).removeClass('xuer-pre-active')
        if (inbox) {
          $switch.find(`.xuer-active`).removeClass('xuer-active')
        } else {
          $switch.find(`.xuer-active`).addClass('xuer-pre-active').removeClass('xuer-active')
        }
        $switch.find(`.${mediaId}`).addClass('xuer-active')

        _this.changeLink(variantId)
      });
    })
  }
  changeLink (variantId) {
    Array.from(this.querySelectorAll(`[href*="/products"]`)).forEach((link) => {
      let url;
      if (link.tagName === "A") {
        url = new URL(link.href);
      } else {
        url = new URL(link.getAttribute("href"), `https://${theme.routes.host}`);
      }
      url.searchParams.set("variant", variantId);
      link.setAttribute("href", url.toString());
    });
  }
};
window.customElements.define("xuer-product-item", ProductItem);

// Video
var Video = class extends BaseHTMLElement {
  connectedCallback () {
    this.autoplay = this.$container.data('autoplay')
    this.provider = this.$container.data('provider')
    this.ratio = this.$container.data('videoRatio')
    this.contentWindow = null
    this.$iframe = null
    this.play()
  }
  async play() {
    if (!this.contentWindow) {
      await this.load()
    }
    if (this.provider === "youtube") {
      this.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: "" }), "*");
    } else if (this.provider === "vimeo") {
      this.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
    }
  }

  pause() {
    if (!this.contentWindow) {
      return;
    }
    if (this.provider === "youtube") {
      this.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: "" }), "*");
    } else if (this.provider === "vimeo") {
      this.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
    }
  }

  load () {
    return new Promise(resolve => {
      const $template = this.$container.find('template')
      this.$iframe = $($template.html())
      this.resize()
      this.$iframe.on('load', () => {
        this.contentWindow = this.$iframe[0].contentWindow
        this.$container.find('.video-placehlder').remove()
        this.addResizeListener(this.resize.bind(this))
        resolve()
      })
      this.$container.append(this.$iframe)
    })
  }

  resize() {
    const width = this.$container.width()
    const height = width * this.ratio / 100
    this.$iframe.height(height)
  }
  
};
window.customElements.define("xuer-video", Video);

var Timeline = class extends BaseHTMLElement {
  connectedCallback() {
    const _this = this
    this.initSwiper({
      breakpoints: {
        1200: { slidesPerView: 5 },
        992: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
      spaceBetween: 24,
      centeredSlides: true,
      on: {
        init: function () {
          const slide = this.slides.eq(this.activeIndex)
          _this.resetActiveSwiper(slide)
        },
        slideChange: function () {
          const slide = this.slides.eq(this.activeIndex)
          _this.resetActiveSwiper(slide)
        },
      },
    });
  }
  resetActiveSwiper(slide) {
    const title = $(slide).data('title')
    const content = $(slide).data('content')
    this.$container.find('.time-line_title').html(title)
    this.$container.find('.time-line_content').html(content)
  }
};
window.customElements.define("xuer-time-line", Timeline);

/*******
 * quick-buy
 */

var QuickBuy = class extends BaseHTMLElement {
  connectedCallback () {
  }
};
window.customElements.define("xuer-quick-buy", QuickBuy);

// tab-nav
var TabNav = class extends BaseHTMLElement {
  connectedCallback () {
    this.activeIdx = this.$container.data('active')
    const contentId = this.$container.data('tab_content_id')
    this.$tabItems = $(`#${contentId}`).find('xuer-tab-item')
    this.$tabNavs = this.$container.find('.xuer-button')
    this.itemSize = 100 / this.$tabItems.length
    console.log('this.itemSize', this.itemSize)
    this.init()
    this.bindClick()
  }
  init () {
    this.$container.append('<span class="active-bar"></span>')
    
    this.triggerActive(this.activeIdx)
  }
  bindClick () {
    const _this = this
    this.$tabNavs.each(function(idx, el) {
      $(el).click(function() {
        _this.triggerActive(idx)
      })
    })
  }
  triggerActive(idx) {
    this.$tabNavs.not(`:eq(${idx})`).removeClass('active')
    this.$tabNavs.eq(idx).addClass('active')
    this.$tabItems.not(`:eq(${idx})`).removeClass('active')
    this.$tabItems.eq(idx).addClass('active')
    this.$container.attr('data-active', idx)
    this.$container.find('.active-bar').css({
      left: `${this.itemSize * idx}%`,
      width: `${this.itemSize}%`
    })
  }
};
window.customElements.define("xuer-tab-nav", TabNav);
