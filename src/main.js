import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripFilterPresenter from './presenter/trip-filter-presenter.js';
import TripSortPresenter from './presenter/trip-sort-presenter.js';
import TripContentPresenter from './presenter/trip-content-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import SortModel from './model/sort-model.js';

const CSSClasses = {
  TRIP_MAIN_CONTAINER: '.trip-main',
  TRIP_FILTER_CONTAINER: '.trip-controls__filters',
  TRIP_EVENTS: '.trip-events'
};

const mainContainer = document.querySelector(CSSClasses.TRIP_MAIN_CONTAINER); // Контейнер для отрисовки общей информации о путешествии
const filterContainer = document.querySelector(CSSClasses.TRIP_FILTER_CONTAINER); // Контейнер для фильтров
const eventsContainer = document.querySelector(CSSClasses.TRIP_EVENTS); // Общий контейнер для событий

// TODO: Нужна модель на пункты назначения и офферы
const filterModel = new FilterModel();
const pointsModel = new PointsModel();
const sortModel = new SortModel();

const tripHeaderPresenter = new TripHeaderPresenter({
  mainContainer,
  pointsModel
});
const tripFilterPresenter = new TripFilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});
const tripSortPresenter = new TripSortPresenter({
  sortContainer: eventsContainer,
  sortModel,
  filterModel,
  pointsModel
});
const tripContentPresenter = new TripContentPresenter({
  eventsContainer,
  pointsModel,
  filterModel,
  sortModel,
});

tripHeaderPresenter.init();
tripFilterPresenter.init();
tripSortPresenter.init();
tripContentPresenter.init();
