var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  disconnectedCallback() {}
  getData(key) {
    return $(this).data(key)
  }
};

var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    const swiperId = this.getData('swiper-container-id')
    this.curSlider = new Swiper(`#${swiperId}`, {
      loop: 'true',
      direction : 'vertical',
      effect: "creative",
      creativeEffect: {
        prev: {
          translate: [0, 0, -400],
          opacity:0
        },
        next: {
          translate: ["100%", 0, 0],
          opacity:1
        },
      },
      autoplay:true,
    });
  }
  disconnectedCallback() {
    this.curSlider && this.curSlider.disable()
  }
};
window.customElements.define("xuer-announcement-bar", AnnouncementBar);



// var swiper = new Swiper('.swiper-container1',{
//   direction : 'vertical',
//   followFinger : false,
//   speed:800,
//   mousewheel: true,
//   pagination : {
//     el:'.swiper-pagination',
//   },
//   on:{
//     init:function(swiper){
//           slide=this.slides.eq(0);
//         slide.addClass('ani-slide');
//       },
//     transitionStart: function(){
//         for(i=0;i<this.slides.length;i++){
//           slide=this.slides.eq(i);
//             slide.removeClass('ani-slide');
//       }
//       },
//     transitionEnd: function(){
//       slide=this.slides.eq(this.activeIndex);
//         slide.addClass('ani-slide');
      
//       },
//   }
//   });