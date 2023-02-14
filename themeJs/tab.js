// tab-nav
var TabNav = class extends BaseHTMLElement {
  connectedCallback () {
    this.activeIdx = this.$container.data('active')
    const contentId = this.$container.data('tab_content_id')
    this.$tabItems = $(`#${contentId}`).find('xuer-tab-item')
    this.$tabNavs = this.$container.find('.xuer-button')
    this.itemSize = 100 / this.$tabItems.length
    console.log('this.itemSize', this.itemSize)
    this.init()
    this.bindClick()
  }
  init () {
    this.$container.append('<span class="active-bar"></span>')
    
    this.triggerActive(this.activeIdx)
  }
  bindClick () {
    const _this = this
    this.$tabNavs.each(function(idx, el) {
      $(el).click(function() {
        _this.triggerActive(idx)
      })
    })
  }
  triggerActive(idx) {
    this.$tabNavs.not(`:eq(${idx})`).removeClass('active')
    this.$tabNavs.eq(idx).addClass('active')
    this.$tabItems.not(`:eq(${idx})`).removeClass('active')
    this.$tabItems.eq(idx).addClass('active')
    this.$container.attr('data-active', idx)
    this.$container.find('.active-bar').css({
      left: `${this.itemSize * idx}%`,
      width: `${this.itemSize}%`
    })
  }
};
window.customElements.define("xuer-tab-nav", TabNav);
