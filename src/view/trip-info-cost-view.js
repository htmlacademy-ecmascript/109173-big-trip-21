import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoCostTemplate({ cost }) {
  return (cost > 0) ? /*html*/`
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  ` : '';
}

export default class TripInfoCostView extends AbstractView {
  #cost = null;

  constructor({ cost = 0 } = {}) {
    super();

    this.#cost = cost;
  }

  get template() {
    return createTripInfoCostTemplate({ cost: this.#cost });
  }
}
