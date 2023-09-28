import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { isEscKey } from '../utils/utils.js';
import { ActionType, TripBoardMode, UpdateType } from '../utils/const.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';
export default class TripPointPresenter {
  #point = null;
  #pointsContainer = null;
  #allDestinations = null;

  #getOffersByType = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;

  #isNewPoint = false;
  #isEditing = false;

  #onChangeCallback = null;
  #onBeforeEditCallback = null;
  #setBoardMode = null;
  #getBoardMode = null;

  constructor({
    point,
    container,
    allDestinations,
    getOffersByType,
    onChangeCallback,
    onBeforeEditCallback,
    setBoardMode,
    getBoardMode,
    isNewPoint,
  }) {
    this.#point = point;
    this.#pointsContainer = container;
    this.#allDestinations = allDestinations;
    this.#getOffersByType = getOffersByType;
    this.#onChangeCallback = onChangeCallback;
    this.#onBeforeEditCallback = onBeforeEditCallback;
    this.#setBoardMode = setBoardMode;
    this.#getBoardMode = getBoardMode;
    this.#isNewPoint = isNewPoint;
  }

  init(point = this.#point) {
    const pointData = {
      point,
      allDestinations: [...this.#allDestinations],
      typedOffers: [...this.#getOffersByType(point.type)],
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
    if (!this.#isEditing) {
      return;
    }

    if(this.#isNewPoint) {
      this.destroy();
    }

    this.#updateView(this.#point);
    this.#replaceFormToPoint();
  }

  destroy(pointComponent = this.#pointComponent, pointEditComponent = this.#editPointComponent) {
    remove(pointComponent);
    remove(pointEditComponent);

    this.#removeKeyDownHandler();
  }

  setSavingState() {
    this.#editPointComponent
      .updateElement({
        isSaving: true,
        isDisabled: true,
      });
  }

  setDeletingState() {
    this.#editPointComponent
      .updateElement({
        isDeleting: true,
        isDisabled: true,
      });
  }

  setErrorState() {
    if(this.#getBoardMode() === TripBoardMode.DEFAULT) {
      return this.#pointComponent.shake();
    }

    this.#editPointComponent.shake(this.clearState.bind(this));
  }

  clearState() {
    this.#editPointComponent
      .updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
  }

  #renderPoint() {
    const renderPosition = this.#isNewPoint
      ? RenderPosition.AFTERBEGIN
      : RenderPosition.BEFOREEND;

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
    this.#setBoardMode(TripBoardMode.EDITING);
    this.#setKeyDownHandler();
    this.#isEditing = true;

    if(this.#isNewPoint) {
      this.#setBoardMode(TripBoardMode.ADDING_NEW_POINT);
    }
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#removeKeyDownHandler();
    this.#isEditing = false;
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
    if (!isEscKey(evt)) {
      return;
    }

    evt.preventDefault();
    this.#pointCancelEditHandler();
    this.#removeKeyDownHandler();
  };

  #pointEditHandler = () => {
    this.#setBoardMode(TripBoardMode.EDITING);
    this.#replacePointToForm();
  };

  #pointCancelEditHandler = () => {
    if(this.#isNewPoint) {
      this.destroy();
      this.#setBoardMode(TripBoardMode.DEFAULT);
      this.#onChangeCallback(ActionType.CANCEL_CREATING_POINT, UpdateType.MAJOR);
      return;
    }

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

  #favoriteToggleHandler = (isFavorite) => {
    this.#onChangeCallback(
      ActionType.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite}
    );
  };

  #pointSubmitHandler = (point) => {
    const actionType = this.#isNewPoint
      ? ActionType.ADD_POINT
      : ActionType.UPDATE_POINT;

    this.#onChangeCallback(actionType, UpdateType.MAJOR, point);
  };

  #pointDeleteHandler = (deletedPoint) => {
    this.#onChangeCallback(
      ActionType.DELETE_POINT,
      UpdateType.MAJOR,
      deletedPoint,
    );
  };
}
