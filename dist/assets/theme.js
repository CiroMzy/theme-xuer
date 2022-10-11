
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
      loop: datas.swiperLoop,
      autoplay: datas.swiperAutoplay,
      speed: datas.swiperSpeed || 300,
      effect: datas.swiperEffect || 'slide',
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
  bindViewAllClick() {

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
  open(type) {
    switch(type) {
      case 'search':
        this.insertHtml(this.searchTplId)
        $(this).addClass('open')
        this.controller = new Search()
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
    $('[data-active]').click(function() {
      var type = $(this).data('action-type')      
      theme.drawer.open(type)
    })
  }
};
window.customElements.define("xuer-header", Header);


var Slideshow = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper()
  }
};
window.customElements.define("xuer-slideshow", Slideshow);

