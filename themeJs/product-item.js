/*******
 * product-item
 */

var ProductItem = class extends BaseHTMLElement {
  connectedCallback () {
    this.$imageWrapper = this.$container.find('.product-image-wrapper')
    this.bindHover()
    this.bindVariantChange()
  }
  bindHover () {
    this.$hoverImage = this.$imageWrapper.find('.product-image_hover')
    const _this = this
    this.$imageWrapper.hover(function () {
      _this.$hoverImage.addClass('xuer-active')
      _this.$container.find('.quick-buy-button').addClass('xuer-active')
    }, function () {
      _this.$hoverImage.removeClass('xuer-active')
      _this.$container.find('.quick-buy-button').removeClass('xuer-active')
    })
  }
  bindVariantChange () {
    const _this = this
    
    this.$container.find('.xuer-color-swatch_item').each(function(idx, el) {
      const name = $(el).data('name')
      const inbox = _this.$container.find('.xuer-color-swatch').data('inbox')
      $(this).find(`input[type=radio][name=${name}]`).change(function (e) {
        const mediaId = $(e.target).data('media')
        const $switch = _this.$container.find('.product-image_switch')
        const variantId = $(e.target).data('variantId')
        
        _this.$container.find('.product-image_default').css('opacity', 0)
        $switch.find(`.xuer-pre-active`).removeClass('xuer-pre-active')
        if (inbox) {
          $switch.find(`.xuer-active`).removeClass('xuer-active')
        } else {
          $switch.find(`.xuer-active`).addClass('xuer-pre-active').removeClass('xuer-active')
        }
        $switch.find(`.${mediaId}`).addClass('xuer-active')

        _this.changeLink(variantId)
      });
    })
  }
  changeLink (variantId) {
    Array.from(this.querySelectorAll(`[href*="/products"]`)).forEach((link) => {
      let url;
      if (link.tagName === "A") {
        url = new URL(link.href);
      } else {
        url = new URL(link.getAttribute("href"), `https://${theme.routes.host}`);
      }
      url.searchParams.set("variant", variantId);
      link.setAttribute("href", url.toString());
    });
  }
};
window.customElements.define("xuer-product-item", ProductItem);
