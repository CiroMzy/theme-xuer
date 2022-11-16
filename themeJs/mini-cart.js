var MiniCartIcon = class extends BaseHTMLElement {
  connectedCallback() {
    theme.event.resetCartCount = this.resetCartCount.bind(this);
  }
  resetCartCount(updateToDrawer) {
    theme.ajax.get(theme.routes.cart_url_js).then((cart) => {
      this.$container.find(".min-cart-count").html(cart.item_count);
      this.getSectionHtml("mini-cart").then(res => {
        const mini_cart_html = res['mini-cart']
        $("#mini-cart-tpl").html(mini_cart_html);
        if (updateToDrawer) {
          $("[drawer-content]").html(mini_cart_html);
        }
      })
    });
  }
};

var MiniCart = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindDelCart();
    theme.event.miniCartCountChange = this.quantityChange.bind(this);
  }

  getProductItemId(el, getDom) {
    if (getDom) {
      return $(el).parents("[mini-product-item]");
    }
    return $(el).parents("[mini-product-item]").data("cartId");
  }

  quantityChange({ quantity, e }) {
    this.cartChange({ quantity, el: e });
  }

  bindDelCart() {
    var _this = this;
    this.$container.find("[mini-cart-remove]").click(function () {
      _this.cartChange({ quantity: 0, el: this });
    });
  }

  cartChange({ quantity, el }) {
    var id = this.getProductItemId(el);
    var $parent = this.getProductItemId(el, true);
    var $img = $($parent.find("[xuer-image]"));
    $img.attr("loading", true);
    theme.ajax
      .post(theme.routes.cart_change_url, {
        id,
        quantity,
      })
      .then(() => {
        $img.attr("loading", false);
        theme.event.dispatch("resetCartCount", true);
      });
  }
};

window.customElements.define("xuer-mini-cart", MiniCart);
window.customElements.define("xuer-mini-cart-icon", MiniCartIcon);
