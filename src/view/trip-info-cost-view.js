import ComponentInterface from './ComponentInterface';

function createTripInfoCostTemplate() {
  return `<p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
          </p>`;
}

export default class TripInfoCost extends ComponentInterface {
  constructor() {
    super(createTripInfoCostTemplate());
  }
}
