var MiniCartIcon = class extends BaseHTMLElement {
  connectedCallback() {
    theme.event.resetCartCount = this.resetCartCount.bind(this);
    this.resetCartCount();
  }
  resetCartCount() {
    theme.ajax.get(theme.routes.cart_url_js).then((cart) => {
      this.$container.find('.min-cart-count').html(cart.item_count)
      if (!cart.items.length) return;
      var product = cart.items[0];
      console.log("cart", cart);
      this.setCartHtml(product.product_id)
    });
  }
  setCartHtml(productId) {
    const url = `${theme.routes.product_recommendations_url}`;
    theme.ajax.get(url,
        {
          product_id: productId,
          limit: 10,
          section_id: "mini-cart",
        },
        { accept: "*/*" }
      )
      .then((res) => {
        $('#mini-cart-tpl').html(res)
      });
  }
};

var MiniCart = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindDelCart();
  }

  bindDelCart() {
    var _this = this
    this.$container.find('[mini-cart-remove]').click(function () {
      var id = $(this).data('cartId')
      _this.cartChange({ id, quantity:0, el: $(this)})
    })
  }

  cartChange ({id, quantity, el}) {
    theme.ajax.post(theme.routes.cart_change_url, {
      id,
      quantity
    }).then(res => {
      if (quantity === 0) {
        var $parent = el.parents('[mini-product-item]')
        $parent.remove()
      }
      console.log('res', res);
    })
  }
};

window.customElements.define("xuer-mini-cart", MiniCart);
window.customElements.define("xuer-mini-cart-icon", MiniCartIcon);
