/*******
 * PriceRange
 */

var PriceRange = class extends BaseHTMLElement {
  connectedCallback () {
    this.datas = this.$container.data()
    this.debounceUpdate = theme.debounce(this.debounceUpdateHandler, 500);
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
      onstatechange: this.onPriceChange.bind(this)
    });
  }
  onPriceChange (e) {
    var prices = e.split(',')
    this.startPrice = prices[0]
    this.endPrice = prices[1]
    this.$container.find('.price-start').html(this.startPrice)
    this.$container.find('.price-end').html(this.endPrice)
    this.debounceUpdate({startPrice:this.startPrice, endPrice:this.endPrice })
    
  }
  debounceUpdateHandler (params) {
    return new Promise(resolve => {
      theme.event.dispatch('priceRangeChange', params)
      resolve()
    })
  }
};
window.customElements.define("xuer-price-range", PriceRange);
