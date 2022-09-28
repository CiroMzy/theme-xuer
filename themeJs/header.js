
var Header = class extends BaseHTMLElement {
  connectedCallback () {
    this.bindMouseEvent()

  }
  bindMouseEvent () {
    $('[data-active]').click(function() {
      var type = $(this).data('action-type')      
      theme.drawer.open(type)
    })
  }
};
window.customElements.define("xuer-header", Header);
