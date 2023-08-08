import ComponentInterface from './ComponentInterface';

function createTripEventsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripEventsList extends ComponentInterface {
  constructor() {
    super(createTripEventsListTemplate());
  }
}
