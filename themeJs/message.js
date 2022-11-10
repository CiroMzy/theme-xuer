var Message = class {
  constructor() {
    this.init();
    this.datas = {};
    this.timer = null;
  }
  init() {
    var html = $("#xuer-message-tpl").html();
    $("body").append(html);
    this.$container = $("#xuer-message-container");
    this.datas = this.$container.find(".xuer-message-text").data();
  }

  loading(params) {
    this.show({
      ...params,
      className: "loading",
      content: params.content | this.datas.loading,
    });
  }

  success(params) {
    this.show({
      ...params,
      className: "success",
      content: params.content | this.datas.success,
    });
  }

  error(params) {
    this.show({
      ...params,
      className: "success",
      content: params.content | this.datas.error,
    });
  }

  show({ content, className, timeout }) {
    this.$container.find(".xuer-message-text").html(content);
    this.$container.addClass(`${className} show`);
    this.timeoutHandler(timeout);
  }

  timeoutHandler(timeout = 3000) {
    this.timer && clearTimeout(this.timer);
    if (timeout === 0) {
      return;
    }
    this.timer = setTimeout(() => {
      this.hide();
    }, timeout);
  }
  hide() {
    this.$container.removeClass("loading show success error");
  }
};
