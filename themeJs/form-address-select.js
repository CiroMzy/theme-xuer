var AddressSelect = class extends BaseHTMLElement {

  connectedCallback() {
    this.$country = $(this.$container.find('[country]'))
    this.$province = $(this.$container.find('[province]'))
    setTimeout(() => this.resetProvince())
    this.$country.find('select').on('change', () => {
      this.resetProvince()
    })
  }
  resetProvince () {
    this.countryValue = this.$country.find('select').val()
    this.provinceOptions = this.$country.find("option:selected").data("provinces")
    var selectedProvice = this.$province.find('select').data('value')
    if (this.provinceOptions.length) {
      var optionHtml = this.createProvinceOptions(this.provinceOptions, selectedProvice)
      this.$province.show().find('select').html(optionHtml)
    } else {
      this.$province.hide().find('select').html("")
    }
  }
  createProvinceOptions (list, selectedVal) {
    var str = ``
    list.forEach(pro => {
      var selected = selectedVal === pro[0] ? 'selected' : ''
      str += `<option value="${pro[0]}" ${selected}>${pro[1]}</option>`
    })
    return str
  }

};
window.customElements.define("xuer-form-address-select", AddressSelect);
