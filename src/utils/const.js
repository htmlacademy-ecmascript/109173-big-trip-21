import { DateFormats } from './utils.js';

const END_POINT = 'https://21.objects.pages.academy/big-trip';
const AUTH_TOKEN = 'Basic 44b7-b4ca-e34f0eb25871';
const RANDOM_PHOTOS_SERVICE_URL = 'https://loremflickr.com/248/152?random=';
const CITY_NAMES = ['Moskow', 'London', 'Amsterdam', 'New Zealand', 'Switzerland', 'China', 'Japan'];
const OFFER_NAMES = ['Transfer', 'Meet in Airport', 'Extra Luggage', 'Lunch', 'Switch to comfort'];
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const BLANK_POINT = {
  id: crypto.randomUUID(),
  type: POINT_TYPES[5],
  destination: '',
  dates: {
    start: '',
    end: '',
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
};
const ActionType = {
  CREATE_POINT: 'CREATE_POINT',
  CANCEL_CREATING_POINT: 'CANCEL_CREATING_POINT',
  ADD_POINT: 'ADD_POINT',
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  RESET_FILTERS: 'RESET_FILTERS'
};
const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};
const TripBoardMode = {
  LOADING: 'LOADING',
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING_NEW_POINT: 'ADDING_NEW_POINT'
};
const API_URL = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
};

const TRIP_EVENTS_LIST_TEMPLATE = '<ul class="trip-events__list"></ul>';
const TRIP_INFO_TEMPLATE = '<section class="trip-main__trip-info  trip-info"></section>';

export {
  END_POINT,
  AUTH_TOKEN,
  CITY_NAMES,
  RANDOM_PHOTOS_SERVICE_URL,
  OFFER_NAMES,
  POINT_TYPES,
  BLANK_POINT,
  POINTS_COUNT,
  FLATPIKR_SETTINGS,
  API_URL,
  Method,
  TRIP_EVENTS_LIST_TEMPLATE,
  TRIP_INFO_TEMPLATE,
  ActionType,
  UpdateType,
  TripBoardMode
};
