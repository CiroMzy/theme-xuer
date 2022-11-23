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
    this.getCollectionPage({ ...formData, section_id: this.sectionId }).then(
      (html) => {
        console.log("html", html);
      }
    );
  }
  getFormData() {
    var formEl = this.$container.find("[product-filters-form]");
    var formData = $(formEl).serializeObject();
    formData["sort_by"] = "best-selling";
    return formData;
  }

  getCollectionPage(data) {
    return new Promise((resolve) => {
      theme.ajax
        .get(window.location.pathname, data, { headers: { accept: "*/*" } })
        .then((res) => {
          resolve(res);
        });
    });
  }
};
window.customElements.define("xuer-product-filters", ProductFilters);
