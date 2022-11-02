var AddressForm = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindEvents()
  }
  bindEvents () {
    this.$container.find('form').on('submit', function (e) {
      e.preventDefault()
      var data = $(this).serializeObject()
      
      theme.ajax.post(theme.routes.account_addresses_url, data).then(res => {
        var html = $(res)
        var tpl = html.find('#add-address-tpl')
        console.log('tpl', tpl);
        $('[drawer-content]').html(tpl.html())
      })


    })
  }
};
window.customElements.define("xuer-address-form", AddressForm);
