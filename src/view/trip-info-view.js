import AbstractView from '../framework/view/abstract-view.js';
import { TRIP_INFO_TEMPLATE } from '../utils/const.js';
export default class TripInfoView extends AbstractView {
  get template() {
    return TRIP_INFO_TEMPLATE;
  }
}
