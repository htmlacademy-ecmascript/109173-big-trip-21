import { DateFormats, getMockDate } from './utils.js';

const RANDOM_PHOTOS_SERVICE_URL = 'https://loremflickr.com/248/152?random=';
const CITY_NAMES = ['Moskow', 'London', 'Amsterdam', 'New Zealand', 'Switzerland', 'China', 'Japan'];
const OFFER_NAMES = ['Transfer', 'Meet in Airport', 'Extra Luggage', 'Lunch', 'Switch to comfort'];
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const BLANK_POINT = {
  id: crypto.randomUUID(),
  type: POINT_TYPES[5],
  destination: '',
  dates: {
    start: getMockDate(),
    end: getMockDate(true),
  },
  offers: new Set(),
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
const ActionType = {
  CREATE_POINT: 'CREATE_POINT',
  ADD_POINT: 'ADD_POINT',
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  RESET_FILTERS: 'RESET_FILTERS'
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};
const TripBoardMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING_NEW_POINT: 'ADDING_NEW_POINT'
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
  TRIP_INFO_TEMPLATE,
  ActionType,
  UpdateType,
  TripBoardMode
};
