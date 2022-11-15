var FeaturedProduct = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindForm();
  }
  bindForm() {
    this.forms = this.$container.find('[data-type="add-to-cart-form"]');
    this.$form = $(this.form);
    const _this = this
    this.forms.each(function (idx, form) {
      $(form).on("submit", function (e) {
        e.preventDefault();
        var data = $(this).serializeObject();
        if (!data.id) {
          return;
        }
        var $btn = _this.$container.find('[add-to-cart]')
        _this.setLoading($btn)
        theme.ajax
          .post(theme.routes.cart_add_url_js, {
            ...data,
            sections: "cart-drawer",
          }, true)
          .then((res) => {
            theme.event.dispatch("resetCartCount");
          }).finally(() => {
            _this.setUnLoading($btn)
          });
      });
    });
  }
};
window.customElements.define("xuer-featured-product", FeaturedProduct);
