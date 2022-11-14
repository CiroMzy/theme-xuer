var VariantPicker = class extends BaseHTMLElement {
  constructor() {
    super();
    this.selectedOptions = null;
    this.variantData = null;
  }
  connectedCallback() {
    var _this = this;
		_this.variantChange()
    $("[picker-button]").click(function () {
      setTimeout(() => _this.variantChange());
    });
  }

  variantChange() {
    this.selectedOptions = this.getSelectedOptions();
    this.variantData = this.getVariantData();
    this.selectedVariant = this.getSelectedVariant();
    this.setVariantStatus();
		this.setAddToCartStatus()
    this.setActiveMedia();
    this.setActiveUrl();
  }

  getSelectedOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    return fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }

  getVariantData() {
    return (
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent)
    );
  }

  getSelectedVariant() {
    return this.variantData.find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.selectedOptions[index] === option;
        })
        .includes(false);
    });
  }

  setVariantStatus() {
    var _this = this;
		var deeps = []
    this.$container.find(".xuer-option-item_fieldset").each(function (idx, el) {
			var name = this.dataset.checkboxName
			var value = $(`input[name='${name}']:checked`).val()
			deeps.push({
				key:`option${idx+1}`, value
			})
      $(el).find(".xuer-option-item_input").each(function (i, e) {
          var val = $(e).val();
          const hasAvailable = _this.variantData.some(
            (variant) => {
							let hit = deeps.every(({key, value}, idx) => {
								var curVal = value
								if (idx === deeps.length - 1) {
									curVal = val
								}
								return variant[key] === curVal && variant.available
							})
							return hit
						}
          );

          _this.setClassToVariant({ el: e, hasAvailable });
        });
    });
  }

	setAddToCartStatus () {
		var $addToCart = $(`#${this.dataset.sectionId}`).find('[add-to-cart]')
		if (this.selectedVariant.available) {
			$addToCart.removeClass('disabled').find('[xuer-button-text]').html(theme.language.product_add_to_cart)	
		} else {
			$addToCart.addClass('disabled').find('[xuer-button-text]').html(theme.language.product_variant_no_stock)	
		}
		var $value = $($addToCart.parent().siblings('[name="id"]'))
		$value.val(this.selectedVariant.id)
		this.changeDisabled($value, !this.selectedVariant.available)
	}

  setClassToVariant({ el, hasAvailable }) {
		this.changeClass(el, 'disabled', !hasAvailable)
  }

  setActiveMedia() {
    if (!this.selectedVariant || !this.selectedVariant.featured_media) return;

    this.mediaId = `${this.dataset.sectionId}-${this.selectedVariant.featured_media.id}`;

    var newMedia = document.querySelector(`[data-media-id="${this.mediaId}"]`);
    if (!newMedia) return;

    var slideIndex = $(newMedia).parent().find(".swiper-slide").index(newMedia);
    theme.event[`product-slide-${this.dataset.sectionId}`](slideIndex);
  }

  setActiveUrl() {
    if (!this.selectedVariant || this.dataset.updateUrl === "false") return;
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.selectedVariant.id}`
    );
  }
};
window.customElements.define("xuer-variant-picker", VariantPicker);
