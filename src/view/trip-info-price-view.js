import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoCostTemplate({ price }) {
  return /*html*/`
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`;
}

export default class TripInfoPriceView extends AbstractView {
  #price = null;

  constructor({ price = 0 } = {}) {
    super();

    this.#price = price;
  }

  get template() {
    return createTripInfoCostTemplate({ price: this.#price });
  }
}
