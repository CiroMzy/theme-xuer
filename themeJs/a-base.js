
theme.swipers = {}
theme.event = {
  dispatch: function(key, params) {
    theme.event[key] && theme.event[key](params)
  }
}
theme.ajax = {
  post: function(url, data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "accept": "text/javascript",
        },
        type: "POST",
        url: url,
        data: data,
        dataType:'text',
        success: function (data) {
          resolve(JSON.parse(data))
        },
        error: function (err) {
          reject(err)
        }
      })
    })
  }
}
$.fn.serializeObject = function() { 
  var o = {}; 
  var a = this.serializeArray(); 
  $.each(a, function() { 
    if (o[this.name]) { 
      if (!o[this.name].push) { 
        o[this.name] = [ o[this.name] ]; 
      } 
      o[this.name].push(this.value || ''); 
    } else { 
      o[this.name] = this.value || ''; 
    } 
  }); 
  return o; 
} 

var BaseHTMLElement = class extends HTMLElement {
  constructor() {
    super();
    this.$container = $(this)
  }
  get rootDelegate() {}
  get delegate() {}
  loading() {}
  hideLoading() {}
  attributeChangedCallback() {}
  disconnectedCallback() {
  }
  initSwiper(options={}) {
    var $swiperContainers = $(this).find('[swiper]')
    if ($swiperContainers.length) {
        $swiperContainers.each((idx, el) => {
          var $swiperContainer = $(el)
          var swiperId = $swiperContainer.attr('id')
          var datas = $swiperContainer.data() || {}
          var swiper = new Swiper(`#${swiperId}`, {
            loop: datas.swiperLoop || false,
            autoplay: datas.swiperAutoplay,
            speed: datas.swiperSpeed || 300,
            effect: datas.swiperEffect || 'slide',
            ...options
          });
          theme.swipers[swiperId] = swiper
      })
    }
  }
  changeClass(el, className, status, changeText) {
    if (status) {
      $(el).addClass(className)
      if (changeText) {
        $(el).html($(el).data('disableText'))
      }
    } else {
      $(el).removeClass(className)
      if (changeText) {
        $(el).html($(el).data('activeText'))
      }
    }
  }
  changeDisabled (el, disabled) {
    if (disabled) {
      $(el).attr('disabled', 'disabled')
    } else {
      $(el).removeAttr('disabled')
    }

  }
};

theme.debounce = function (func, wait, callback) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
      var result = func.apply(context, args)
      if (result.then) {
        result.then(res => {
          callback && callback(res)
        })
      } else {
        callback && callback(res)
      }
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};
