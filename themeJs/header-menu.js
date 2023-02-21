var HeaderMenu = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()
  }
  bindMouseEvent () {
    $(this).find('.menu-level-1').hover(function() {
      $(this).addClass('open')
      const $children = $(this).find('.menu-level-2')
      $children.each(function(i, el) {
        $(el).addClass(`xuer-animated xuer-animate_duration-faster xuer-animate_delay${i + 1} xuer-animate_fadeInUp`)
      })
    }, function() {
      $(this).removeClass('open')
      const $children = $(this).find('.menu-level-2')
      $children.each(function(i, el) {
        $(el).removeClass(`xuer-animated xuer-animate_duration-faster xuer-animate_delay${i + 1} xuer-animate_fadeInUp`)
      })
    })
  }

};
window.customElements.define("xuer-header-menu", HeaderMenu);
