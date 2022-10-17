/*******
 * LocalizationForm
 */

var LocalizationForm = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()

  }
  bindMouseEvent () {
    var $container = $('[xuer-list-selector]')
    $container.find('.localization-select-item').click(function() {
      var val = $(this).data('value')
      $container.find('[name=locale_code]').val(val)
    })
  }
};
window.customElements.define("xuer-localization-form", LocalizationForm);
