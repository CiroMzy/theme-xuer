// product-slide
var ProductSlide = class extends BaseHTMLElement {
  connectedCallback () {
    console.log(this.$container);
    this.initSwiper()
    // if (this.$container.data(''))
  }
  initSwiper () {
    var mainId = this.$container.find('[swiper-main]').attr('id')
    var thumbnailId = this.$container.find('[swiper-thumbnail]').attr('id')

    var swiperMain = new Swiper(`#${thumbnailId}`, {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
    var swiperThumb = new Swiper(`#${mainId}`, {
      loop: true,
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: swiperMain,
      },
    });
  }
};
window.customElements.define("xuer-product-slide", ProductSlide);
