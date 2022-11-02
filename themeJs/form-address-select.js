var AddressSelect = class extends BaseHTMLElement {

  connectedCallback() {
    this.$country = $(this.$container.find('[country]'))
    this.$province = $(this.$container.find('[province]'))
    this.resetProvince()
    this.$country.find('select').on('change', () => {
      this.resetProvince()
    })
  }
  resetProvince () {
    this.countryValue = this.$country.find('select').val()
    this.provinceOptions = this.$country.find("option:selected").data("provinces")
    if (this.provinceOptions.length) {
      var optionHtml = this.createProvinceOptions(this.provinceOptions)
      this.$province.show().find('select').html(optionHtml)
    } else {
      this.$province.hide().find('select').html("")
    }
  }
  createProvinceOptions (list) {
    var str = ``
    list.forEach(pro => {
      str += `<option value="${pro[0]}">${pro[1]}</option>`
    })
    return str
  }

};
window.customElements.define("xuer-form-address-select", AddressSelect);
