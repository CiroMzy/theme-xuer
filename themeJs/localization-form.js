/*******
 * LocalizationForm
 */

var LocalizationForm = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()
  }
  bindMouseEvent () {
    var _this = this
    this.$container = $('[xuer-list-selector]')
    this.$container.find('.localization-select-item').click(function() {
      _this.resetChecked()
    })
  }
  resetChecked() {
    var val = $(this).find('input[name=language]:checked').val()
    this.$container.find('[xuer-list]').children().each(function(idx, el) {
      console.log($(this).data('value'), val);
      if ($(this).data('value') === val) {
        $(this).addClass('checked')
          .find('.xuer-radio-wrapper').addClass('xuer-radio-wrapper-checked')
      } else {
        $(this).removeClass('checked')
          .find('.xuer-radio-wrapper').removeClass('xuer-radio-wrapper-checked')
      }
    })
    this.$container.find('[name=locale_code]').val(val)


  }
};
window.customElements.define("xuer-localization-form", LocalizationForm);
