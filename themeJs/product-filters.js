/*******
 * product-filters
 */

var ProductFilters = class extends BaseHTMLElement {
  connectedCallback() {
    this.sectionId = this.$container.data("sectionId");
    theme.event.formChange.push(this.updatePageFilters.bind(this));
  }
  updatePageFilters() {
    var formData = this.getFormData();
    var searchParamsAsString = new URLSearchParams(formData).toString();
    var href = `${window.location.pathname}?${searchParamsAsString}`;
    history.replaceState({}, "", href);
    this.getCollectionPage(`${href}&section_id=${this.sectionId}`).then(
      (html) => {
        console.log("html", html);
      }
    );
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
