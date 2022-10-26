var Slideshow = class extends BaseHTMLElement {
  connectedCallback() {
    var slides,imgBox,imgPrev,imgActive,derection
    var lock = false
		var imageBoxSelector = '.slideshow-image'
		var imageSelector = 'img'
    
    this.initSwiper({
			speed: 1300,
			parallax: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			on: {
				transitionStart: function () {
					lock = true; //锁住按钮
					slides = this.slides
					imgBox = slides.eq(this.previousIndex).find(imageBoxSelector)
					imgPrev = slides.eq(this.previousIndex).find(imageSelector)
					imgActive = slides.eq(this.activeIndex).find(imageSelector)
					derection = this.activeIndex - this.previousIndex
					var $activeSlide = $(slides.eq(this.activeIndex))
					var slideBgColor= $activeSlide.data('background-color')
					this.$el.css("background-color", slideBgColor);
					imgBox.transform('matrix(0.6, 0, 0, 0.6, 0, 0)');
					imgPrev.transition(1000).transform('matrix(1.2, 0, 0, 1.2, 0, 0)'); //图片缩放视差
					this.slides.eq(this.previousIndex).find('.text').transition(1000).css('color', 'rgba(255,255,255,0)'); //文字透明动画

					imgPrev.transitionEnd(function () {
						imgActive.transition(1300).transform('translate3d(0, 0, 0) matrix(1.2, 0, 0, 1.2, 0, 0)'); //图片位移视差
						imgPrev.transition(1300).transform('translate3d(' + 60 * derection +
							'%, 0, 0)  matrix(1.2, 0, 0, 1.2, 0, 0)');
					});
				},
				transitionEnd: function () {
					this.slides.eq(this.activeIndex).find(imageBoxSelector).transform(' matrix(1, 0, 0, 1, 0, 0)');
					var $activeSlide = $(this.slides.eq(this.activeIndex))
					var textColor = $activeSlide.data('text-color')
					imgActive = this.slides.eq(this.activeIndex).find(imageSelector)
					imgActive.transition(1000).transform(' matrix(1, 0, 0, 1, 0, 0)');
					this.slides.eq(this.activeIndex).find('.text').transition(1000).css('color', textColor);

					imgActive.transitionEnd(function () {
						lock = false
					});
				},
				init: function () {
					this.emit('transitionEnd'); //在初始化时触发一次transitionEnd事件
				},

			}
		});
  }
};
window.customElements.define("xuer-slideshow", Slideshow);
