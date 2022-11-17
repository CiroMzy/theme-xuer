
var Collapse = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindEvents()
  }
  bindEvents () {
    this.$container.find('.xuer-collapse_item').each(function(idx, el) {
      var $item = $(el)
      $(el).find('.xuer-collapse_item-title').click(function () {
        if ($item.hasClass('open')) {
          $item.removeClass('open')
        } else {
          $item.addClass('open')
        }
      })
    })
    
  }

};

window.customElements.define("xuer-collapse", Collapse);
