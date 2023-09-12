import TripFilterPresenter from './presenter/trip-filter-presenter.js';
import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripContentPresenter from './presenter/trip-content-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';

const CSSClasses = {
  TRIP_MAIN_CONTAINER: '.trip-main',
  TRIP_FILTER_CONTAINER: '.trip-controls__filters',
};

const mainContainer = document.querySelector(CSSClasses.TRIP_MAIN_CONTAINER); // Контейнер для отрисовки общей информации о путешествии
const filterContainer = document.querySelector(CSSClasses.TRIP_FILTER_CONTAINER); // Контейнер для фильтров

const filterModel = new FilterModel();
const pointsModel = new PointsModel();

/** TODO: Объеденить хэдер и контентную часть в один презентер для упрощения работы с фильтрацией? */
const tripFilterPresenter = new TripFilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});
const tripHeaderPresenter = new TripHeaderPresenter({ mainContainer });
const tripContentPresenter = new TripContentPresenter({ pointsModel, filterModel });

tripHeaderPresenter.init(tripContentPresenter);
tripFilterPresenter.init();
tripContentPresenter.init();
