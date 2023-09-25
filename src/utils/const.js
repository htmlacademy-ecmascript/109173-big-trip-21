const END_POINT = 'https://21.objects.pages.academy/big-trip';
const AUTH_TOKEN = 'Basic 44b7-b4ca-e34f0eb25871';
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const BLANK_POINT = {
  type: POINT_TYPES[5].toLowerCase(),
  destination: '',
  dates: {
    start: '',
    end: '',
  },
  offers: new Set(),
  cost: 0,
  isFavorite: false,
};
const DatesFormat = {
  FLATPICKR: 'd/m/y H:i', // Для Флэтпикера
  DATE_TIME: 'YYYY-MM-DD[T]hh:mm', // Для тега datetime
  PATH: 'DD/MM/YY',
  DAY: 'DD',
  CHOSED_DATE: 'DD/MM/YY HH:mm', // Дата и время начала события
  FOR_POINT_PERIODS: 'HH:mm', // Для периодов, выбранных для точки маршрута
  FOR_POINT: 'MMM DD', // Дата для каждой конкретной точки маршрута
  FOR_HEAD_DATES: 'DD MMM',
  // Форматирование продолжительности нахождения в точке маршрута
  LESS_THAN_HOUR: 'mm', // Менее часа
  LESS_THAN_DAY: 'HH mm', // Менее суток
  MORE_THAN_DAY: 'DD HH mm' // Более суток
};
const FlatpickrSettings = {
  enableTime: true,
  dateFormat: DatesFormat.FLATPICKR,
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
  INIT_SUCCESS: 'INIT_SUCCESS',
  INIT_FAILED: 'INIT_FAILED',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};
const TripBoardMode = {
  LOADING: 'LOADING',
  LOADING_FAILED: 'LOADING_FAILED',
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING_NEW_POINT: 'ADDING_NEW_POINT'
};
const ApiUrl = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};
const TimeLimit = {
  LOWER: 100,
  UPPER: 1000
};

export {
  END_POINT,
  AUTH_TOKEN,
  POINT_TYPES,
  BLANK_POINT,
  FlatpickrSettings,
  ApiUrl,
  DatesFormat,
  ActionType,
  UpdateType,
  TripBoardMode,
  Method,
  TimeLimit,
};
