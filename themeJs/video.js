// Video
var Video = class extends BaseHTMLElement {
  connectedCallback () {
    this.autoplay = this.$container.data('autoplay')
    this.provider = this.$container.data('provider')
    this.ratio = this.$container.data('videoRatio')
    this.contentWindow = null
    this.$iframe = null
    this.play()
  }
  async play() {
    if (!this.contentWindow) {
      await this.load()
    }
    if (this.provider === "youtube") {
      this.contentWindow.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: "" }), "*");
    } else if (this.provider === "vimeo") {
      this.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
    }
  }

  pause() {
    if (!this.contentWindow) {
      return;
    }
    if (this.provider === "youtube") {
      this.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: "" }), "*");
    } else if (this.provider === "vimeo") {
      this.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
    }
  }

  load () {
    return new Promise(resolve => {
      const $template = this.$container.find('template')
      this.$iframe = $($template.html())
      this.resize()
      this.$iframe.on('load', () => {
        this.contentWindow = this.$iframe[0].contentWindow
        this.$container.find('.video-placehlder').remove()
        this.addResizeListener(this.resize.bind(this))
        resolve()
      })
      this.$container.append(this.$iframe)
    })
  }

  resize() {
    const width = this.$container.width()
    const height = width * this.ratio / 100
    this.$iframe.height(height)
  }
  
};
window.customElements.define("xuer-video", Video);
