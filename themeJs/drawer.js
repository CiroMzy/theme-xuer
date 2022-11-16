
var Drawer = class extends BaseHTMLElement {
  connectedCallback () {
    theme.drawer = this
    this.$container = $(this)
    this.bindMouseEvent()
    this.controller = null
    
  }
  bindMouseEvent () {
    var _this = this
    this.$container.find('[action-close]').click(function() {
      _this.close()
    })
  }
  open(type) {
    this.insertHtml(type)
    $(this).addClass('open')
    $(this).find('[drawer-main]').addClass(`open ${this.drawerType}`)
    $('body').addClass('lock')
  }
  close () {
    $('body').removeClass('lock')
    this.$container.removeClass(`open ${this.drawerType}`)
  }

  insertHtml (tplId) {
    var $con = $(`#${tplId}`)
    this.html = $con.html()
    this.title = $con.data('title')
    $(this).find('[drawer-content]').html(this.html)
    $(this).find('.title').html(this.title)
  }

 
};
window.customElements.define("xuer-drawer", Drawer);
