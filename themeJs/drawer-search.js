
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
