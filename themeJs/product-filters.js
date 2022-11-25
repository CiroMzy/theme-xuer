/*******
 * product-filters
 */

var ProductFilters = class extends BaseHTMLElement {
  connectedCallback() {
    this.sectionId = this.$container.data("sectionId");
    theme.event.formChange = this.updatePageFilters.bind(this)
  }
  updatePageFilters() {
    var formData = this.getFormData();
    var searchParamsAsString = new URLSearchParams(formData).toString();
    var href = `${window.location.pathname}?${searchParamsAsString}`;
    history.replaceState({}, "", href);
    this.getCollectionPage(`${href}&section_id=${this.sectionId}`).then(
      (html) => {
        this.resetHtmlToDom(html)
      }
    );
  }
  resetHtmlToDom (html) {
    var $resultHtml = $(html)
    var mainHtml = $resultHtml.find('[collection-main]').html()
    var $main = $('[collection-main]')
    $main.html(mainHtml)
    var $asideHtml = $($resultHtml.find('[collection-aside]').html())
    var $aside = $('[collection-aside]')
    $aside.find('[xuer-collapse-item]').each((i, el) => {
      var $elTarget = $asideHtml.find('[xuer-collapse-item]').eq(i)
      if ($(el).hasClass('open')) {
        $elTarget.addClass('open')
      } else {
        $elTarget.removeClass('open')
      }
    })
    $aside.html($asideHtml)
  }
  getFormData() {
    const formEl = this.$container.find("[product-filters-form]");
    const formData = new FormData(formEl[0]);
    formData.append("sort_by", "best-selling");
    return formData;
  }

  getCollectionPage(href) {
    return new Promise((resolve) => {
      theme.ajax
        .get(href, {}, { headers: { accept: "*/*" } })
        .then((res) => {
          resolve(res);
        });
    });
  }
};
window.customElements.define("xuer-product-filters", ProductFilters);
