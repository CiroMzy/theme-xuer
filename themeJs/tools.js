theme.swipers = {};
theme.event = {
  miniCartCountChange: null,
  dispatch: function (key, params) {
    if (!theme.event[key]) return
    var evt = theme.event[key]
    if (Array.isArray(evt)) {
      evt.forEach(fn => {
        fn && fn(params)
      })
    } else {
      evt && evt(params)
    }
  },
};
theme.ajax = {
  post: function (url, data, message) {
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "text/javascript",
        },
        type: "POST",
        url: url,
        data: data,
        dataType: "text",
        success: function (data) {
          try{
            resolve(JSON.parse(data));
          } catch{
            resolve(data)
          }
          message && theme.message.success()
        },
        error: function (err) {
          reject(err);
          theme.message.error()
        },
      });
    });
  },
  get: function (url, params, headers = {}, oterConfig = {}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          accept: "text/javascript",
          ...headers,
        },
        type: "GET",
        url: url,
        data: params,
        dataType: "text",
        ...oterConfig,
        success: function (data) {
          var res = null
          try{
            res = JSON.parse(data)
          } catch(e) {
            res = data
          }
          resolve(res)
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  },
};

theme.debounce = function (func, wait, callback) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      var result = func.apply(context, args);
      if (result.then) {
        result.then((res) => {
          callback && callback(res);
        });
      } else {
        callback && callback(res);
      }
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

theme.message = new Message()
$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};