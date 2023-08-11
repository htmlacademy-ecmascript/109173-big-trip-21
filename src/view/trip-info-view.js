import ComponentInterface from './ComponentInterface';

function createTripInfoTemplate() {
  return '<section class="trip-main__trip-info  trip-info"></section>';
}

export default class TripInfoView extends ComponentInterface {
  constructor() {
    super(createTripInfoTemplate());
  }
}
