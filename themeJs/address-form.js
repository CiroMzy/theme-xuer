var AddressForm = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindEvents()
  }
  bindEvents () {
    var _this = this
    this.$container.find('form').on('submit', function (e) {
      e.preventDefault()
      var btn = _this.$container.find('.xuer-button')
      if (_this.isDisable(btn)) {
        return
      }
      var data = $(this).serializeObject()
      $(btn).attr('loading', true)
      
      theme.ajax.post(theme.routes.account_addresses_url, data).then(res => {
        var html = $(res)
        var tpl = html.find('#add-address-tpl')
        var tplHtml = tpl.html()
        if (tplHtml.indexOf('xuer-form-error-msg') > -1) {
          $('[drawer-content]').html(tplHtml)
        } else {
          window.location.reload()
        }
      })
    })
  }
};
window.customElements.define("xuer-address-form", AddressForm);
