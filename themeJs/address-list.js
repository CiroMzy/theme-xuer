var AddressList = class extends BaseHTMLElement {
  connectedCallback() {
    this.addressList = this.addressList || JSON.parse(this.querySelector('[type="application/json"]').textContent)
    console.log('this.addressList', this.addressList);
    this.bindEdit()
  }
  bindEdit () {
    this.$container.find('[address-edit]').click(function () {
      var id = $(this).data('addressId')
      console.log('id',id);
      
    })
  }
};
window.customElements.define("xuer-address-list", AddressList);
