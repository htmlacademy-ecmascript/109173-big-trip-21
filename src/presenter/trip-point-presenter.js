import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { isEscKey } from '../utils/utils.js';
import { ActionType, TripBoardMode, UpdateType } from '../utils/const.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class TripPointPresenter {
  #point = null;
  #isNewPoint = false;
  #pointDefaultState = null;
  #pointsContainer = null;
  #destinationsList = null;

  #offersModel = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;
  #pointIsEditing = false;

  #onChangeCallback = null;
  #onBeforeEditCallback = null;
  #setBoardMode = null;
  #getBoardMode = null;

  constructor({
    container,
    destinationsList,
    offersModel,
    onChangeCallback,
    onBeforeEditCallback,
    setBoardMode,
    getBoardMode,
    isNewPoint,
  }) {
    this.#pointsContainer = container;
    this.#destinationsList = destinationsList;
    this.#offersModel = offersModel;
    this.#onChangeCallback = onChangeCallback;
    this.#onBeforeEditCallback = onBeforeEditCallback;
    this.#setBoardMode = setBoardMode;
    this.#getBoardMode = getBoardMode;
    this.#isNewPoint = isNewPoint;
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
      typedOffersList: this.#offersModel.getOffersByPointType(this.#point.type),
    };

    // Компоненты предыдущей точки маршрута
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    // Компоненты текущей точки маршрута
    this.#pointComponent = new TripEventsListItemView({
      ...pointData,
      onEditCallback: this.#pointEditHandler,
      onFavoriteToggleCallback: this.#favoriteToggleHandler,
    });

    this.#editPointComponent = new EditPointView({
      ...pointData,
      isNewPoint: this.#isNewPoint,
      onTypeChangeCallback: this.#pointTypeChangeHandler,
      onDestinationChangeCallback: this.#pointDestinationChangeHandler,
      onDateChangeCallback: this.#pointDateChangeHandler,
      onPriceChangeCallback: this.#pointPriceChangeCallback,
      onSubmitCallback: this.#pointSubmitHandler,
      onDeletePointCallback: this.#pointDeleteHandler,
      onCancelEditCallback: this.#pointCancelEditHandler
    });

    if(this.#prevPointComponent === null && this.#prevEditPointComponent === null) {
      this.#renderPoint();
      return;
    }

    // Замена точки маршрута новой (если она отрисована в DOM-дереве)
    this.#reRenderPoint();
  }

  reset() {
    if (!this.isEditing()) {
      return;
    }

    if(this.#isNewPoint) {
      this.destroy();
    }

    this.#replaceFormToPoint();
  }

  destroy(pointComponent = this.#pointComponent, pointEditComponent = this.#editPointComponent) {
    remove(pointComponent);
    remove(pointEditComponent);

    this.#removeKeyDownHandler();
  }

  isEditing() {
    return this.#pointIsEditing;
  }

  #renderPoint() {
    const renderPosition = this.#isNewPoint ? RenderPosition.AFTERBEGIN : RenderPosition.BEFOREEND;

    render(this.#pointComponent, this.#pointsContainer, renderPosition);

    if(this.#isNewPoint) {
      this.#replacePointToForm();
    }
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

  #updateView(updatedPoint) {
    // Метод для визуального обновления view (без изменения данных)
    // необходим для возможности вернуть точку к первоначальному состоянию
    this.init(updatedPoint);
  }

  #replacePointToForm() {
    this.#onBeforeEditCallback();
    replace(this.#editPointComponent, this.#pointComponent);
    this.#setKeyDownHandler();
    this.#pointIsEditing = true;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#removeKeyDownHandler();
    this.#pointIsEditing = false;
    this.#setBoardMode(TripBoardMode.DEFAULT);
  }

  #setKeyDownHandler() {
    document.addEventListener('keydown', this.#documentKeyDownHandler);
  }

  #removeKeyDownHandler() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
  }

  /** Обработчики */
  #documentKeyDownHandler = (evt) => {
    if (!isEscKey(evt) || !this.#pointIsEditing) {
      return;
    }

    evt.preventDefault();
    this.#pointCancelEditHandler();
    this.#removeKeyDownHandler();
  };

  #pointEditHandler = () => {
    this.#replacePointToForm();
  };

  #pointCancelEditHandler = () => {
    if(this.#isNewPoint) {
      this.destroy();
      this.#setBoardMode(TripBoardMode.DEFAULT);
      return;
    }

    this.#point = this.#pointDefaultState;

    this.#updateView(this.#point);
    this.#replaceFormToPoint();
  };

  #pointTypeChangeHandler = (pointWithNewType) => {
    this.#updateView(pointWithNewType);
    this.#setKeyDownHandler();
  };

  #pointDestinationChangeHandler = (pointWithNewDestination) => {
    this.#updateView(pointWithNewDestination);
    this.#setKeyDownHandler();
  };

  #pointDateChangeHandler = (pointWithNewDates) => this.#updateView(pointWithNewDates);
  #pointPriceChangeCallback = (pointWithNewPrice) => this.#updateView(pointWithNewPrice);

  #favoriteToggleHandler = (isFavorite) => {
    this.#point.isFavorite = isFavorite;
    this.#pointDefaultState.isFavorite = isFavorite;
    this.#onChangeCallback(
      ActionType.UPDATE_POINT,
      UpdateType.PATCH,
      this.#point
    );
  };

  #pointSubmitHandler = (point) => {
    const actionType = this.#isNewPoint ? ActionType.ADD_POINT : ActionType.UPDATE_POINT;

    this.#pointDefaultState = null;
    this.#onChangeCallback(actionType, UpdateType.MAJOR, point);
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
