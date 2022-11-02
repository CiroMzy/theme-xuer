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
      default:
        this.insertHtml(type)
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
