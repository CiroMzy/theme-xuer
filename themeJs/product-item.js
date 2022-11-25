/*******
 * product-item
 */

var ProductItem = class extends BaseHTMLElement {
  connectedCallback () {
    this.initSwiper()
  }
};
window.customElements.define("xuer-product-item", ProductItem);
