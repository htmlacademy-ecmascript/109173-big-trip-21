import {render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoCostView from '../view/trip-info-cost-view.js';

export default class TripHeaderPresenter {
  #mainContainer = null;
  #tripInfoContainer = null;

  /** @type {import("./trip-content-presenter.js").default} Экземпляр презентера контента */
  #contentPresenter = null;

  constructor({ mainContainer }) {
    this.#mainContainer = mainContainer; // Контейнер для отрисовки общей информации о путешествии
    this.#tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия
  }

  init(contentPresenter) {
    this.#contentPresenter = contentPresenter;

    render(this.#tripInfoContainer, this.#mainContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(new TripInfoMainView(), this.#tripInfoContainer.element); // Отрисовываем информацию о маршруте и датах
    render(new TripInfoCostView(), this.#tripInfoContainer.element); // Отрисовываем информацию о цене
  }
}
