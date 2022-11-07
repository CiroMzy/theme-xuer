var AddressList = class extends BaseHTMLElement {
  connectedCallback() {
    this.$addressTpl = $($('#add-address-tpl').html())
    this.bindEdit()
    this.bindDelete()
  }
  bindEdit () {
    this.$container.find('[address-edit]').click(function () {
      var id = $(this).data('addressId')
      if (!id) {
        return
      }
      theme.drawer.open(`add-address-tpl-${id}`)
    })
  }
  bindDelete () {
    this.$container.find('[address-delete]').click(function () {
      var id = $(this).data('addressId')
      if (!id) {
        return
      }
      theme.ajax.post(`${theme.routes.account_addresses_url}/${id}`, {
        _method: 'delete'
      }).then(() => {
        window.location.reload()
      })
    })
    
  }
};
window.customElements.define("xuer-address-list", AddressList);
