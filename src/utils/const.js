const END_POINT = 'https://21.objects.pages.academy/big-trip';
const AUTH_TOKEN = 'Basic 44b7-b4ca-e34f0eb25871';
const RANDOM_PHOTOS_SERVICE_URL = 'https://loremflickr.com/248/152?random=';
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const DEFAULT_POINT_TYPE = 'Flight';
const BLANK_POINT = {
  id: crypto.randomUUID(),
  type: DEFAULT_POINT_TYPE,
  destination: '',
  dates: {
    start: '',
    end: '',
  },
  offers: new Set(),
  cost: 0,
  isFavorite: false,
};
const DateFormats = {
  FLATPICKR: 'd/m/y H:i', // Для Флэтпикера
  DATE_TIME: 'YYYY-MM-DD[T]hh:mm', // Для тега datetime
  PATH: 'DD/MM/YY',
  DAY: 'DD',
  CHOSED_DATE: 'DD/MM/YY HH:mm', // Дата и время начала события
  FOR_POINT_PERIODS: 'HH:mm', // Для периодов, выбранных для точки маршрута
  FOR_POINT: 'MMM DD', // Дата для каждой конкретной точки маршрута
  // Форматирование продолжительности нахождения в точке маршрута
  LESS_THAN_HOUR: 'mm', // Менее часа
  LESS_THAN_DAY: 'HH mm', // Менее суток
  MORE_THAN_DAY: 'DD HH mm' // Более суток
};
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
  RANDOM_PHOTOS_SERVICE_URL,
  POINT_TYPES,
  BLANK_POINT,
  FLATPIKR_SETTINGS,
  API_URL,
  TRIP_EVENTS_LIST_TEMPLATE,
  TRIP_INFO_TEMPLATE,
  DateFormats,
  ActionType,
  UpdateType,
  TripBoardMode,
  Method,
};
