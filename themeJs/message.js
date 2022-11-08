
var Message = class {
  constructor() {
    this.init()
  }
  init () {
    var html = $('#xuer-message-tpl').html()
    $('body').append(html)
    this.$container = $('#xuer-message-container')
  }

  loading({ content, timeout=0 }) {
    this.$container.find('.xuer-message-text').html(content)
    this.$container.addClass('loading')
    this.timeoutHandler(timeout)
  }
  timeoutHandler () {
    if (timeout === 0) {
      return
    }
    setTimeout(() => {
      this.end()

    }, timeout)
  }
  end () {
    this.$container.removeClass('loading')
  }

};

