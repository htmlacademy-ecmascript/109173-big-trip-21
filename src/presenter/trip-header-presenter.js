import {render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoCostView from '../view/trip-info-cost-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import { createFilters } from '../mock/filter.js';
import { upperCaseFirst } from '../utils/utils.js';
import { FilterType, filters } from '../utils/filter.js';

const CSSClasses = {
  TRIP_MAIN_CONTAINER: '.trip-main',
  TRIP_FILTER_CONTAINER: '.trip-controls__filters',
};
export default class TripHeaderPresenter {
  #tripMainContainer = null;
  #tripInfoContainer = null;
  #tripFilterContainer = null;
  #filtersData = null; // Фильтры
  #currentFilterType = FilterType.EVERYTHING; // Предыдущий выбранный фильтр (по-умолчанию - EVERYTHING)
  /** @type {import("./trip-content-presenter.js").default} Экземпляр презентера контента */
  #contentPresenter = null;

  constructor() {
    this.#tripMainContainer = document.querySelector(CSSClasses.TRIP_MAIN_CONTAINER); // Контейнер для отрисовки общей информации о путешествии
    this.#tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия
    this.#tripFilterContainer = document.querySelector(CSSClasses.TRIP_FILTER_CONTAINER); // Контейнер для фильтров
  }

  init(contentPresenter) {
    this.#contentPresenter = contentPresenter;
    this.#filtersData = {
      items: createFilters(this.#contentPresenter.points),
      onChangeCallback: this.#filtersClickHandler.bind(this),
    };

    render(this.#tripInfoContainer, this.#tripMainContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(new TripInfoMainView(), this.#tripInfoContainer.element); // Отрисовываем информацию о маршруте и датах
    render(new TripInfoCostView(), this.#tripInfoContainer.element); // Отрисовываем информацию о цене
    render(new TripFilterView(this.#filtersData), this.#tripFilterContainer); // Отрисовываем фильтр событий
  }

  #filtersClickHandler(filterType) {
    const filterName = upperCaseFirst(filterType);

    // Исключаем клик по одному и тому же фильтру
    if (this.#currentFilterType === filterName) {
      return;
    }

    const filteredPoints = filters[filterName](this.#contentPresenter.points);

    this.#currentFilterType = filterType;
    this.#contentPresenter.reRenderEventPoints(filteredPoints);
  }
}
