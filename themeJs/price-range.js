/*******
 * PriceRange
 */

var PriceRange = class extends BaseHTMLElement {
  connectedCallback () {
    this.datas = this.$container.data()
    this.bindMouseEvent()
  }
  bindMouseEvent () {
    $('.range-slider').jRange({
      from: this.datas.rangeStart,
      to: this.datas.rangeEnd,
      step: 1,
      scale: [],
      format: '%s',
      width: 300,
      showLabels: false,
      showScale: false,
      isRange : true,
      onstatechange: this.onPriceChange.bind(this)
    });
  }
  onPriceChange (e) {
    var prices = e.split(',')
    this.$container.find('.price-start').html(prices[0])
    this.$container.find('.price-end').html(prices[1])
  }
};
window.customElements.define("xuer-price-range", PriceRange);
