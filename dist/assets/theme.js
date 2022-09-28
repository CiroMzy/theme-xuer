
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

// AnnouncementBar
var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper({
      grabCursor : true,
    })
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);


var Drawer = class extends BaseHTMLElement {
  connectedCallback () {
    theme.drawer = this
    this.searchTplId = 'search-tpl'
    this.$container = $(this)
    this.bindMouseEvent()
    
  }
  bindMouseEvent () {
    var _this = this
    this.$container.find('.drawer-bg').click(function() {
      _this.$container.removeClass('open')
    })
  }
  bindSearch() {
    var _this = this
    this.$container.find('.search').bind("input propertychange", function(e){
      _this.search($(this).val())
    })
  }
  search(val) {
    var _this = this
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
        _this.$container.find('[search-result]').html(response)
        
      },
      error: function error(response) {
        console.log('Error fetching results');
      } 
    });
  }
  open(type) {
    this.insertHtml()
    $(this).addClass('open')
    switch(type) {
      case 'search':
        this.bindSearch()
        break;
        
    }
  }

  insertHtml () {
    var $con = $(`#${this.searchTplId}`)
    this.html = $con.html()
    this.title = $con.data('title')
    $(this).find('.drawer-content').html(this.html)
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
