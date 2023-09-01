import { render, replace, remove } from '../framework/render.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import { isEscKey } from '../utils/utils.js';

export default class TripPointPresenter {
  #point = null;
  #pointsContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #bindedDocumentKeyDownHandler = null;
  #prevPointComponent = null;
  #prevEditPointComponent = null;
  #pointIsEditing = false;

  constructor(container) {
    this.#pointsContainer = container;
  }

  init(point) {
    this.#point = point;

    // Обработчики событий
    this.#point.pointEditCallback = this.#pointEditHandler;
    this.#point.pointFinishEditCallback = this.#pointFinishEditHandler;
    this.#point.pointSubmitCallback = this.#pointSubmitHandler;
    this.#point.pointFavoriteCallback = this.#favoriteClickHandler;

    // Компоненты предыдущей точки маршрута
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    // Компоненты текущей точки маршрута
    this.#pointComponent = new TripEventsListItemView(this.#point); // Точка маршрута
    this.#editPointComponent = new EditPointView(this.#point); // Форма редактирования точки маршрута

    if(this.#prevPointComponent === null && this.#prevEditPointComponent === null) {
      // Отрисовка новой точки маршрута
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    // Замена точки маршрута новой (если она отрисована в DOM-дереве)
    this.#reRenderPoint();
  }

  reset() {
    if (!this.#pointIsEditing) {
      return;
    }
    this.#replaceFormToPoint();
  }

  destroy(pointComponent = this.#pointComponent, pointEditComponent = this.#editPointComponent) {
    remove(pointComponent);
    remove(pointEditComponent);
  }

  isEditing() {
    return this.#pointIsEditing;
  }

  #documentKeyDownHandler = (evt) => {
    if (isEscKey(evt) && this.#pointIsEditing) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }

    document.removeEventListener('keydown', this.#documentKeyDownHandler);
  };

  #pointEditHandler = () => {
    document.addEventListener('keydown', this.#documentKeyDownHandler);
    this.#point.pointBeforeEditCallback(); // Вызываем колбэк общего презентера (для закрытия всех форм редактирования перед открытием новой)
    this.#replacePointToForm();
  };

  #pointFinishEditHandler = () => { // Пока Callback такой же, как и для отправки формы, но, наверняка дальше они будут разными
    this.#replaceFormToPoint();
  };

  #favoriteClickHandler = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#point.pointChangeCallback(this.#point);
  };

  #pointSubmitHandler = () => {
    this.#replaceFormToPoint();
  };

  // Используем функцию, т.к. нужно поднятие
  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);

    this.#pointIsEditing = true;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);

    this.#pointIsEditing = false;
  }

  #reRenderPoint() {
    if(this.#pointsContainer.contains(this.#prevPointComponent.element)) {
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if(this.#pointsContainer.contains(this.#prevEditPointComponent.element)) {
      replace(this.#editPointComponent, this.#prevEditPointComponent);
    }

    this.destroy(this.#prevPointComponent, this.#prevEditPointComponent);
  }
}
