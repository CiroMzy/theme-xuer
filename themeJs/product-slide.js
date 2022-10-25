// product-slide
var ProductSlide = class extends BaseHTMLElement {
  connectedCallback () {
    if (this.$container.is('[use-slide]')) {
      this.initSwiper()
    }
  }
  initSwiper () {
    var mainId = this.$container.find('[swiper-main]').attr('id')
    var thumbnailId = this.$container.find('[swiper-thumbnail]').attr('id')

    var swiperThumb = new Swiper(`#${thumbnailId}`, {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 4,
      watchSlidesProgress: true,
    });
    new Swiper(`#${mainId}`, {
      loop: true,
      spaceBetween: 10,
      autoHeight: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: swiperThumb,
      },
    });
  }
};
window.customElements.define("xuer-product-slide", ProductSlide);
