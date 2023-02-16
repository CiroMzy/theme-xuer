// product-slide
var ProductSlide = class extends BaseHTMLElement {
  connectedCallback () {
    if (this.$container.is('[use-slide]')) {
      this.initSwiper()
      this.bindSlideEvents()
    }
  }
  initSwiper () {
    var mainId = this.$container.find('[swiper-main]').attr('id')
    var thumbnailId = this.$container.find('[swiper-thumbnail]').attr('id')

    var swiperThumb = new Swiper(`#${thumbnailId}`, {
      spaceBetween: 10,
      slidesPerView: 'auto',
      watchSlidesProgress: true,
    });

    var swiperMain = new Swiper(`#${mainId}`, {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: swiperThumb,
      },
    });

    theme.swipers[thumbnailId] = swiperThumb
    this.swiperThumb = swiperThumb
    this.swiperMain = swiperMain
  }
  slideToIndex (index) {
    this.swiperThumb.slideTo(index)
    this.swiperMain.slideTo(index)
  }
  bindSlideEvents () {
    theme.event[`product-slide-${this.dataset.sectionId}`] = this.slideToIndex.bind(this)
  }
};
window.customElements.define("xuer-product-slide", ProductSlide);
