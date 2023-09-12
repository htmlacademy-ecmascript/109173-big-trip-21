import { DateFormats } from './utils.js';

const RANDOM_PHOTOS_SERVICE_URL = 'https://loremflickr.com/248/152?random=';
const CITY_NAMES = ['Moskow', 'London', 'Amsterdam', 'New Zealand'];
const OFFER_NAMES = ['Transfer', 'Meet in Airport', 'Extra Luggage', 'Lunch', 'Switch to comfort'];
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CURRENT_DATE = new Date();
const BLANK_POINT = {
  type: POINT_TYPES[5],
  destination: '',
  dates: {
    start: CURRENT_DATE,
    end: new Date(CURRENT_DATE.getDate() + 1),
  },
  offers: '',
  cost: 0,
  isFavorite: false,
};
const POINTS_COUNT = 4;
const FLATPIKR_SETTINGS = {
  enableTime: true,
  dateFormat: DateFormats.FLATPICKR,
  minuteIncrement: 1,
  'time_24hr': true,
  // 'locale': Russian
};

const TRIP_EVENTS_LIST_TEMPLATE = '<ul class="trip-events__list"></ul>';
const TRIP_INFO_TEMPLATE = '<section class="trip-main__trip-info  trip-info"></section>';

export {
  CITY_NAMES,
  RANDOM_PHOTOS_SERVICE_URL,
  OFFER_NAMES,
  POINT_TYPES,
  BLANK_POINT,
  POINTS_COUNT,
  FLATPIKR_SETTINGS,
  TRIP_EVENTS_LIST_TEMPLATE,
  TRIP_INFO_TEMPLATE
};
