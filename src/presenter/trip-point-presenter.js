import { render, replace } from '../framework/render.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import { isEscKey } from '../utils/utils.js';

export default class TripPointPresenter {
  #pointsContainer = null;
  #point = null;
  #pointComponent = null;
  #editPointComponent = null;
  #bindedDocumentKeyDownHandler = null;

  constructor(container) {
    this.#pointsContainer = container;
  }

  init(point) {
    this.#point = point;

    // Обработчики событий (через bind из за необходимости hoisting некоторых функций)
    this.#point.pointEditCallback = this.#pointEditHandler.bind(this);
    this.#point.pointFinishEditCallback = this.#pointFinishEditHandler.bind(this);
    this.#point.pointSubmitCallback = this.#pointSubmitHandler.bind(this);
    this.#point.pointFavoriteCallback = this.#favoriteClickHandler.bind(this);

    this.#pointComponent = new TripEventsListItemView(this.#point); // Точка маршрута
    this.#editPointComponent = new EditPointView(this.#point); // Форма редактирования точки маршрута
    this.#bindedDocumentKeyDownHandler = this.#documentKeyDownHandler.bind(this);
    // Отрисовка точки маршрута
    render(this.#pointComponent, this.#pointsContainer);
  }

  #documentKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      evt.preventDefault();
      // this.#previousEditingPoint = null;
      this.#replaceFormToPoint();
    }

    document.removeEventListener('keydown', this.#bindedDocumentKeyDownHandler);
  }

  #pointEditHandler() {
    document.addEventListener('keydown', this.#bindedDocumentKeyDownHandler);
    this.#replacePointToForm();
  }

  #pointFinishEditHandler() { // Пока Callback такой же, как и для отправки формы, но, наверняка дальше они будут разными
    // this.#previousEditingPoint = null;
    this.#replaceFormToPoint();
  }

  #favoriteClickHandler() {
    console.log('Добавили в избранное');
  }

  #pointSubmitHandler() {
    // this.#previousEditingPoint = null;
    this.#replaceFormToPoint();
  }

  // Используем функцию, т.к. нужно поднятие
  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
  }
}
