/**
 * TODO:
 * Запретить добавлять пустую точку, т.к. это вызывает
 * ошибку на сервере
 *
 * Отрефакторить парсинг данных в стейт и обратно
 * в компоненте edit-point-view.js
 *
 * Неверная дата окончания путешествия в шапке
 */

import TripFilterPresenter from './presenter/trip-filter-presenter.js';
import TripSortPresenter from './presenter/trip-sort-presenter.js';
import TripContentPresenter from './presenter/trip-content-presenter.js';
import FilterModel from './model/filter-model.js';
import SortModel from './model/sort-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

const CSSClasses = {
  TRIP_MAIN_CONTAINER: '.trip-main',
  TRIP_FILTER_CONTAINER: '.trip-controls__filters',
  TRIP_EVENTS: '.trip-events'
};

const mainHeaderContainer = document.querySelector(CSSClasses.TRIP_MAIN_CONTAINER); // Контейнер для отрисовки общей информации о путешествии
const filterContainer = document.querySelector(CSSClasses.TRIP_FILTER_CONTAINER); // Контейнер для фильтров
const eventsContainer = document.querySelector(CSSClasses.TRIP_EVENTS); // Общий контейнер для событий

const filterModel = new FilterModel();
const sortModel = new SortModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel({ destinationsModel, offersModel });

const tripFilterPresenter = new TripFilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});
const tripSortPresenter = new TripSortPresenter({
  sortContainer: eventsContainer,
  sortModel,
  pointsModel
});
const tripContentPresenter = new TripContentPresenter({
  mainHeaderContainer,
  eventsContainer,
  filterModel,
  sortModel,
  destinationsModel,
  offersModel,
  pointsModel
});

tripFilterPresenter.init();
tripSortPresenter.init();
tripContentPresenter.init();
pointsModel.init();
