var Search = {
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

}


var Drawer = class extends BaseHTMLElement {
  connectedCallback () {
    theme.drawer = this
    this.searchTplId = 'search-tpl'
    this.$container = $(this)
    this.bindMouseEvent()
    
  }
  bindMouseEvent () {
    var _this = this
    this.$container.find('[action-close]').click(function() {
      _this.$container.removeClass('open')
    })
  }
  bindSearch() {
    var _this = this
    this.debounceSearchProduct = theme.debounce(Search.searchProduct, 500, _this.insertSearchResult.bind(_this));
    this.$container.find('.search').bind("input propertychange", function(){
      _this.$container.find('[drawer-loading]').addClass('show')
      _this.debounceSearchProduct($(this).val())
    })
  }
  insertSearchResult(res) {
    this.$container.find('[search-result]').html(res)
    this.$container.find('[drawer-loading]').removeClass('show')
  }
  open(type) {
    this.insertHtml()
    $(this).addClass('open')
    switch(type) {
      case 'search':
        this.bindSearch()
        break;
    }
    $(this).find('[drawer-main]').addClass('open')
  }

  insertHtml () {
    var $con = $(`#${this.searchTplId}`)
    this.html = $con.html()
    this.title = $con.data('title')
    $(this).find('[drawer-content]').html(this.html)
    $(this).find('.title').html(this.title)
  }

 
};
window.customElements.define("xuer-drawer", Drawer);
