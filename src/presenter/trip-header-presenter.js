import {render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMain from '../view/trip-info-main-view.js';
import TripInfoCost from '../view/trip-info-cost-view.js';
import TripFilterView from '../view/trip-filter-view.js';

export default class TripHeaderPresenter {
  #tripMainContainer = null;
  #tripInfoContainer = null;
  #tripFilterContainer = null;

  constructor() {
    this.#tripMainContainer = document.querySelector('.trip-main'); // Контейнер для отрисовки общей информации о путешествии
    this.#tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия
    this.#tripFilterContainer = document.querySelector('.trip-controls__filters'); // Контейнер для фильтров
  }

  init() {
    render(this.#tripInfoContainer, this.#tripMainContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(new TripInfoMain(), this.#tripInfoContainer.element); // Отрисовываем информацию о маршруте и датах
    render(new TripInfoCost(), this.#tripInfoContainer.element); // Отрисовываем информацию о цене
    render(new TripFilterView(), this.#tripFilterContainer); // Отрисовываем фильтр событий
  }
}
