var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  connectedCallback() {}
  disconnectedCallback() {}
};

var AnnouncementBar = class extends BaseHTMLElement {
  connectedCallback () {
    var $slideContainer = $(this).find('.announcement-bar-list')
    if (!$slideContainer.size()) {
      return
    }
    this.curSlider = $(this).slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true,
      draggable: true,
      fade: true,
      vertical: true
    });
  }
  disconnectedCallback() {
    this.curSlider && this.curSlider.destroy()
  }
};


function bindSections() {
  var sectionMapper = {
    "xu-announcement-bar": AnnouncementBar,
  };
  Object.keys(sectionMapper).forEach((k) => {
    window.customElements.define(k, sectionMapper[k]);
  });
}

$(function () {
  bindSections();
});
