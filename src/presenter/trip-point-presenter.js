import { render, replace, remove } from '../framework/render.js';
import { isEscKey } from '../utils/utils.js';
import { ActionType, UpdateType } from '../utils/const.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class TripPointPresenter {
  #point = null;
  #pointDefaultState = null;
  #pointsContainer = null;
  #destinationsList = null;
  #offersList = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;
  #pointIsEditing = false;

  #onChangeCallback = null;
  #onBeforeEditCallback = null;

  constructor({
    container,
    destinationsList,
    offersList,
    onChangeCallback,
    onBeforeEditCallback,
  }) {
    this.#pointsContainer = container;
    this.#destinationsList = destinationsList;
    this.#offersList = offersList;
    this.#onChangeCallback = onChangeCallback;
    this.#onBeforeEditCallback = onBeforeEditCallback;
  }

  init(point) {
    /**
     * Если не копировать точку, то при изменении типа в pointTypeChangeHandler
     * this.#point.type на новый, по какой-то причине меняется и копия в
     * this.#pointDefaultState <-- Выяснить?
     */
    this.#point = structuredClone(point);

    if(this.#pointDefaultState === null) { // Сохранение точки для возможности последующего восстановления
      this.#pointDefaultState = structuredClone(point);
    }

    const pointData = {
      point: this.#point,
      destinationsList: this.#destinationsList,
      typeOffersList: this.#offersList,
    };

    // Компоненты предыдущей точки маршрута
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    // Компоненты текущей точки маршрута
    this.#pointComponent = new TripEventsListItemView({
      ...pointData,
      onEditCallback: this.#pointEditHandler,
      onFavoriteCallback: this.#favoriteClickHandler,
    });

    this.#editPointComponent = new EditPointView({
      ...pointData,
      onCancelEditCallback: this.#pointCancelEditHandler,
      onSubmitCallback: this.#pointSubmitHandler,
      onTypeChangeCallback: this.#pointTypeChangeHandler,
      onDestinationChangeCallback: this.#pointDestinationChangeHandler,
      onDeletePointCallback: this.#pointDeleteHandler
    });

    if(this.#prevPointComponent === null && this.#prevEditPointComponent === null) {
      // Отрисовка новой точки маршрута
      render(this.#pointComponent, this.#pointsContainer);
      return;
    }

    // Замена точки маршрута новой (если она отрисована в DOM-дереве)
    this.#reRenderPoint();
  }

  reset() {
    if (!this.isEditing()) {
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

  #updateView = (updatedPoint) => {
    // Метод для визуального обновления view (без изменения данных)
    // необходим для возможности вернуть точку к первоначальному состоянию
    this.init(updatedPoint);
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

  /** Обработчики */
  #documentKeyDownHandler = (evt) => {
    if (!isEscKey(evt) || !this.#pointIsEditing) {
      return;
    }

    evt.preventDefault();
    this.#pointCancelEditHandler();

    document.removeEventListener('keydown', this.#documentKeyDownHandler);
  };

  #pointEditHandler = () => {
    document.addEventListener('keydown', this.#documentKeyDownHandler);

    this.#onBeforeEditCallback(); // Вызываем колбэк общего презентера (для закрытия всех форм редактирования перед открытием новой)
    this.#replacePointToForm();
  };

  #pointCancelEditHandler = () => { // Пока Callback такой же, как и для отправки формы, но, наверняка дальше они будут разными
    this.#point = this.#pointDefaultState;

    this.#updateView(this.#point);
    this.#replaceFormToPoint();
  };

  #pointTypeChangeHandler = (pointType) => {
    this.#point.type = pointType;
    this.#point.offers = new Set(); // Реализация сброса выбранных офферов, при смене типа поинта
    this.#updateView(this.#point);
  };

  #pointDestinationChangeHandler = (newDestination) => {
    document.addEventListener('keydown', this.#documentKeyDownHandler);

    this.#point.destination = newDestination;
    this.#updateView(this.#point);
  };

  #favoriteClickHandler = (isFavorite) => {
    this.#point.isFavorite = isFavorite;
    this.#pointDefaultState.isFavorite = isFavorite;
    this.#onChangeCallback(
      ActionType.UPDATE_POINT,
      UpdateType.PATCH,
      this.#point
    );
  };

  #pointSubmitHandler = (updatedPoint) => {
    // this.#point = {...this.#point, ...updatedPoint};
    this.#pointDefaultState = null;
    this.#onChangeCallback(
      ActionType.UPDATE_POINT,
      UpdateType.PATCH,
      updatedPoint,
    );
    this.#replaceFormToPoint();
  };

  #pointDeleteHandler = (deletedPoint) => {
    this.#onChangeCallback(
      ActionType.DELETE_POINT,
      UpdateType.MAJOR,
      deletedPoint,
    );
    this.#replaceFormToPoint();
  };
}
