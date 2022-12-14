// FormInput
var FormInput = class extends BaseHTMLElement {
  connectedCallback () {
    this.isTextarea = this.$container.hasClass('is_textarea')
    this.$input = $(this.$container.find('[xuer-input]'))  
    
    this.focusClass = 'xuer-focus'
    this.bindChange()
    this.init()
  }
  init () {
    var val = this.getCurInputVal()
    this.troggleFocus(val)
  }
  bindChange () {
    var _this = this
    this.$input.bind("input propertychange",function(event){
      var val = _this.getCurInputVal()
      _this.troggleFocus(val)
    });
  }

  troggleFocus (val) {
    if (!val.length) {
      this.$input.removeClass(this.focusClass)
    } else {
      if (!this.$input.hasClass(this.focusClass)) {
        this.$input.addClass(this.focusClass)
      }
    }
  }

  getCurInputVal () {
    return this.$input.val() === undefined ? '' : this.$input.val()
  }
};
window.customElements.define("xuer-form-input", FormInput);
