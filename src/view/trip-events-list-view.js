import AbstractView from '../framework/view/abstract-view.js';
import { TRIP_EVENTS_LIST_TEMPLATE } from '../utils/const.js';

export default class TripEventsListView extends AbstractView {
  get template() {
    return TRIP_EVENTS_LIST_TEMPLATE;
  }
}
