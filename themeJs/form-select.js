var FormSelect = class extends BaseHTMLElement {

  connectedCallback() {
    this.resetSelected()
  }
  resetSelected () {
    var value = this.$container.find('[xuer-select]').data('value')
    this.$container.find(`option[value='${value}']`).prop('selected', true)
  }
};
window.customElements.define("xuer-form-select", FormSelect);
