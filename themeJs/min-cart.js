var MinCart = class extends BaseHTMLElement {
  connectedCallback() {
    theme.event.resetCartCount = this.resetCartCount.bind(this);
    this.resetCartCount();
  }
  resetCartCount() {
    theme.ajax.get(theme.routes.cart_url_js).then((cart) => {
      $("[min-cart-count]").html(cart.item_count);
      this.cart = cart;
      var html = this.createMiniCart();
			console.log('html', html);
			$('#mini-cart-tpl').html(html)
    });
  }

  createMiniCart() {
    var productHtml = this.createMinProductItems();

		return `
		<xuer-min-cart id="min-cart-container">
			${productHtml}

  </xuer-min-cart>
		`
  }

  createMinProductItems() {
    var productStr = "";
    this.cart.items.forEach((product) => {
      var tpl = $("#mini-product-tpl").html();
      var $product = $(tpl);
      $product.find(".mini-product_image").attr("src", product.image);
      $product
        .find(".mini-product_title")
        .attr("href", product.url)
        .html(product.product_title);
			var productHtml = $product.prop("outerHTML")
			productStr += productHtml
    });
		return productStr
  }
};
window.customElements.define("xuer-min-cart", MinCart);
