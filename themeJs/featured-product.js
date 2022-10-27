var FeaturedProduct = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindForm()
  }
  bindForm () {
    this.forms = this.$container.find('[data-type="add-to-cart-form"]')
    this.$form = $(this.form)
    this.forms.each(function (idx,form) {
      $(form).on('submit', function (e) {
        e.preventDefault()
        var data = $(this).serializeObject()
        if (!data.id) {
          return
        }
        theme.ajax.post(theme.routes.cart_add_url_js, {
          ...data,
          quantity: "1",
          sections: "cart-drawer"
        }).then(res => {
          console.log('res', res);
          theme.event.dispatch('resetCartCount')
        })


      })
    })
  }
};
window.customElements.define("xuer-featured-product", FeaturedProduct);
