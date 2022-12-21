var Timeline = class extends BaseHTMLElement {
  connectedCallback() {
    const _this = this
    this.initSwiper({
      loop: true,
      breakpoints: {
        1200: { slidesPerView: 5 },
        992: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
      spaceBetween: 24,
      centeredSlides: true,
      on: {
        init: function () {
          const slide = this.slides.eq(this.activeIndex)
          _this.resetActiveSwiper(slide)
        },
        slideChange: function () {
          const slide = this.slides.eq(this.activeIndex)
          _this.resetActiveSwiper(slide)
        },
      },
    });
  }
  resetActiveSwiper(slide) {
    const title = $(slide).data('title')
    const content = $(slide).data('content')
    this.$container.find('.time-line_title').html(title)
    this.$container.find('.time-line_content').html(content)
  }
};
window.customElements.define("xuer-time-line", Timeline);
