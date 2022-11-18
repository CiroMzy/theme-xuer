var QuantitySelector = class extends BaseHTMLElement {
  connectedCallback() {
    this.$input = $(this.$container.find('input'))
    this.debounceUpdate = theme.debounce(this.debounceUpdateHandler);
    this.bindInputEvents();
    this.bindButtons()
  }
  bindInputEvents() {
    var _this = this
    this.$input.bind("input propertychange",function(event){
      var val = _this.getCurInputVal()
      _this.setInputVal(val)
    });

    this.$input.on('change', function () {
      var val = _this.getCurInputVal()
      if (!val) {
        _this.setInputVal(1)
      }
    })
  }

  bindButtons () {
    var _this = this
    this.$container.find('.quantity_min').click(function() {
      var val = _this.getCurInputVal()
      var newVal = --val
      _this.setInputVal(Math.max(newVal, 1))
    })

    this.$container.find('.quantity_plus').click(function() {
      var val = _this.getCurInputVal()
      var max = _this.$input.attr('max')
      var newVal = ++val
      
      if (max && !isNaN(max) && (newVal > max)) {
        newVal = max
      }
      _this.setInputVal(newVal)
    })
  }

  setInputVal (val) {
    this.$input.val(val)
    this.$input.attr('size', `${val}`.length)
    if (this.$container.data('trigger') === 'mini-cart') {
      this.debounceUpdate({
        e: this.$input,
        quantity: val
      })
    }
  }

  debounceUpdateHandler (params) {
    return new Promise(resolve => {
      theme.event.dispatch('miniCartCountChange', params)
      resolve()
    })
  }

  getCurInputVal () {
    var val = this.$input.val()
    if (!val) {
      val = 1
    }
    var num = /^\d{0,}$/
    if (!num.test(val)) {
      var val = val.replace(/\D/g, '')
    }
    return Number(val)
  }


};
window.customElements.define("xuer-quantity-selector", QuantitySelector);
