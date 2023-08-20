import AbstractView from '../framework/view/abstract-view.js';

const TRIP_INFO_TEMPLATE = '<section class="trip-main__trip-info  trip-info"></section>';

export default class TripInfoView extends AbstractView {
  get template() {
    return TRIP_INFO_TEMPLATE;
  }
}
