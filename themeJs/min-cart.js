var MinCart = class extends BaseHTMLElement {
  connectedCallback() {
		theme.event.resetCartCount = this.resetCartCount.bind(this)
		this.resetCartCount()
  }
	resetCartCount () {
		theme.ajax.get(theme.routes.cart_url_js).then(res => {
			$('[min-cart-count]').html(res.item_count)
		})
	}
};
window.customElements.define("xuer-min-cart", MinCart);
