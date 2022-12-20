
var Collapse = class extends BaseHTMLElement {
  connectedCallback() {
    this.bindEvents()
  }
  bindEvents () {
    this.$container.find('[xuer-collapse-item]').each(function(idx, el) {
      var $item = $(el)
      var initHeight = $item.find('[xuer-collapse-content]').outerHeight()
      $item.find('[xuer-collapse-main]').height(initHeight)
      
      $(el).find('[xuer-collapse-title]').click(function () {
        if ($item.hasClass('open')) {
          $item.find('[xuer-collapse-main]').height(0)
          $item.find('[xuer-collapse-content]').removeClass('xuer-animate_fadeInUp')
          $item.removeClass('open')
        } else {
          var height = $item.find('[xuer-collapse-content]').outerHeight()
          $item.find('[xuer-collapse-main]').height(height)
          $item.find('[xuer-collapse-content]').addClass('xuer-animate_fadeInUp')
          $item.addClass('open')
        }
      })
    })
    
  }

};

window.customElements.define("xuer-collapse", Collapse);
