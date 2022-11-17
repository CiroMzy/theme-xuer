
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
    $(this).find('[xuer-header]').addClass('xuer-animate_fadeInUp')
    $(this).find('[drawer-content]').addClass('xuer-animate_fadeInUp')
    $('body').addClass('lock')
  }
  close () {
    $('body').removeClass('lock')
    this.$container.removeClass(`open ${this.drawerType}`)
    this.$container.find('[xuer-header]').removeClass('xuer-animate_fadeInUp')
    this.$container.find('[drawer-content]').removeClass('xuer-animate_fadeInUp')
    
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
