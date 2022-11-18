/*******
 * product-filters
 */

var ProductFilters = class extends BaseHTMLElement {
  connectedCallback () {
    this.sectionId = this.$container.data('sectionId')
    this.bindEvent()
  }
  bindEvent () {
    theme.event.priceRangeChange = this.updatePageFilters.bind(this);
  }
  updatePageFilters (params) {
    this.startPrice = params.startPrice
    this.endPrice = params.endPrice
    var formData = this.getFormData()
    this.getCollectionPage(formData).then(html => {
      console.log('html', html);
    })
  }
  getFormData () {
    var formEl = this.$container.find('[product-filters-form]')
    var formData = $(formEl).serializeObject()
    formData['filter.v.price.gte'] = this.startPrice
    formData['filter.v.price.lte'] = this.endPrice
    formData['section_id'] = this.sectionId
    formData['sort_by'] = 'best-selling'
    return formData
  }

  getCollectionPage (data) {
    return new Promise(resolve => {
      theme.ajax.get(window.location.pathname, data, {headers:{accept: '*/*'}}).then((res) => {
        resolve(res)
      });
    })
  }
};
window.customElements.define("xuer-product-filters", ProductFilters);
