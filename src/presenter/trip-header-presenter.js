import {render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoCostView from '../view/trip-info-cost-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import { createFilters } from '../mock/filter.js';

const CSSClasses = {
  TRIP_MAIN_CONTAINER: '.trip-main',
  TRIP_FILTER_CONTAINER: '.trip-controls__filters',
};
export default class TripHeaderPresenter {
  #tripMainContainer = null;
  #tripInfoContainer = null;
  #tripFilterContainer = null;
  #filters = null; // Фильтры

  constructor() {
    this.#tripMainContainer = document.querySelector(CSSClasses.TRIP_MAIN_CONTAINER); // Контейнер для отрисовки общей информации о путешествии
    this.#tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия
    this.#tripFilterContainer = document.querySelector(CSSClasses.TRIP_FILTER_CONTAINER); // Контейнер для фильтров
  }

  init(points) {
    this.#filters = createFilters(points); // Информация о фильтрах

    render(this.#tripInfoContainer, this.#tripMainContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(new TripInfoMainView(), this.#tripInfoContainer.element); // Отрисовываем информацию о маршруте и датах
    render(new TripInfoCostView(), this.#tripInfoContainer.element); // Отрисовываем информацию о цене
    render(new TripFilterView(this.#filters), this.#tripFilterContainer); // Отрисовываем фильтр событий
  }
}
