
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
    this.debounceSearchProduct = theme.debounce(_this.searchProduct, 800, _this.insertSearchResult.bind(_this));
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
