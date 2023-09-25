import AbstractView from '../framework/view/abstract-view.js';

const TRIP_EVENTS_LIST_TEMPLATE = '<ul class="trip-events__list"></ul>';
export default class TripEventsListView extends AbstractView {
  get template() {
    return TRIP_EVENTS_LIST_TEMPLATE;
  }
}
