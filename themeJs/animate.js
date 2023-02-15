theme.initAnimate = function () {
  var finishedClass = 'xuer-finished'
  var defaultAnimateClass = 'xuer-animate_fadeInUp'
  if (window.innerWidth >= 768) {
    if ("IntersectionObserver" in window) {
      var intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !entry.target.classList.contains(finishedClass)
            ) {
              setTimeout(() => {
                let $target = $(entry.target)
                let animateClass = $target.attr('xuer-animated') || defaultAnimateClass
                $(entry.target).addClass(animateClass)
              }, 200);
              observer.unobserve(entry.target);
            }
          });
        }
      );
      $(`[xuer-animated]:not(.${finishedClass})`).each((idx, el) => {
          intersectionObserver.observe(el);
      })
    } else {
      $(`[xuer-animated]:not(.${finishedClass})`).each((idx, el) => {
          $(el).addClass(`${finishedClass} ${defaultAnimateClass}`)
      })
    }
  }
};
theme.initAnimate()
document.addEventListener('shopify:section:load', () => {
  theme.initAnimate()
});