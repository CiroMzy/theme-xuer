var Slideshow = class extends BaseHTMLElement {
  connectedCallback() {
		const _this = this
		this.cacheIndex = 0
		this.datas = this.$container.find('[swiper]').data()
		let options = {}
		switch (this.datas.swiperSlideType) {
			case 'fade':
				options = {
					effect: 'fade'
				}
				break
			case 'sweep':
				options = {
					grabCursor: true,
					effect: "creative",
					autoplay: true,
					loop: true,
					creativeEffect: {
						prev: {
							shadow: true,
							translate: ["-20%", 0, -1],
						},
						next: {
							translate: ["100%", 0, 0],
						},
					}
				}
				break
			case 'slide':
				options = {}
				break;
		}


    this.initSwiper({
			...options,
			pagination: {
				el: ".swiper-pagination",
			},
			speed: _this.datas.swiperSpeed,
			on: {
				init: function () {
					_this._slides = this.slides
					_this.slideShow(0)
				},
				slideChangeTransitionStart: function () {
					if (!_this._slides) {
						_this._slides = this.slides
					}
					_this.slideHide(this.activeIndex)
				},
				slideChangeTransitionEnd: function () {
					if (!_this._slides) {
						_this._slides = this.slides
					}
					_this.slideShow(this.activeIndex)
				},
			}
		});
  }
	slideShow (idx) {
		const $activeSlider = this._slides.eq(idx)
		this.$animateItem = $activeSlider.find(".slide-animate").addClass(`xuer-animated xuer-animate__${this.datas.swiperTextType}`)
	}
	slideHide (idx) {
		const $activeSlider = this._slides.eq(this.cacheIndex)
		this.$animateItem = $activeSlider.find(".slide-animate").removeClass(`xuer-animated xuer-animate__${this.datas.swiperTextType}`)
		this.cacheIndex = idx
	}
};
window.customElements.define("xuer-slideshow", Slideshow);
