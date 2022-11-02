// FormCheckbox
var FormCheckbox = class extends BaseHTMLElement {
  connectedCallback () {
    this.$input = $(this.$container.find('[xuer-input]'))
    this.bindChange()
  }
  bindChange () {
    this.$input.change(() => {
      var val = this.$input.is(':checked') ? 1 : 0
      this.$input.val(val)
    });
  }
};
window.customElements.define("xuer-form-checkbox", FormCheckbox);
