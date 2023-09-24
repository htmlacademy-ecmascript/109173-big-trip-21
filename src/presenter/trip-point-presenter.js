import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { isEscKey } from '../utils/utils.js';
import { ActionType, TripBoardMode, UpdateType } from '../utils/const.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';
import Validator from '../validator.js';
export default class TripPointPresenter {
  #point = null;
  #pointDefaultState = null;
  #pointsContainer = null;
  #destinationsList = null;

  #offersModel = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;

  #isNewPoint = false;
  #isEditing = false;
  #isOptionsLoaded = null;

  #onChangeCallback = null;
  #onBeforeEditCallback = null;
  #setBoardMode = null;
  #validator = null;

  constructor({
    point,
    container,
    destinationsList,
    offersModel,
    onChangeCallback,
    onBeforeEditCallback,
    setBoardMode,
    isNewPoint,
    isOptionsLoaded,
  }) {
    this.#point = point;
    this.#pointsContainer = container;
    this.#destinationsList = destinationsList;
    this.#offersModel = offersModel;
    this.#onChangeCallback = onChangeCallback;
    this.#onBeforeEditCallback = onBeforeEditCallback;
    this.#setBoardMode = setBoardMode;
    this.#isNewPoint = isNewPoint;
    this.#isOptionsLoaded = isOptionsLoaded;
  }

  init(point = this.#point) {
    if(this.#pointDefaultState === null) { // Сохранение точки для возможности последующего восстановления
      this.#pointDefaultState = structuredClone(point);
    }

    const pointData = {
      point,
      destinationsList: this.#destinationsList,
      typedOffersList: this.#offersModel.getByPointType(point.type),
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
      isOptionsLoaded: this.#isOptionsLoaded ,
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
    const onErrorStateCallback = () => {
      this.#editPointComponent
        .updateElement({
          isSaving: false,
          isDeleting: false,
          isDisabled: false,
        });
    };

    this.#editPointComponent.shake(onErrorStateCallback);
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
    this.#setValidator(this.#editPointComponent.element);
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
    this.#isEditing = true;
    this.#setValidator(this.#editPointComponent.element);

    if(this.#isNewPoint) {
      this.#setBoardMode(TripBoardMode.ADDING_NEW_POINT);
    }
  }

  #setValidator(validatingElement) {
    this.#validator = new Validator(validatingElement);
    this.#validator.init();
  }

  #resetValidator() {
    if(!this.#validator) {
      return;
    }

    this.#validator.reset();
    this.#validator.destroy();
    this.#validator = null;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#removeKeyDownHandler();
    this.#isEditing = false;
    this.#setBoardMode(TripBoardMode.DEFAULT);
    this.#resetValidator();
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

  #pointEditHandler = () => this.#replacePointToForm();

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

    point.cost = (point.cost <= 0) ? 1 : point.cost;

    const isValidForm = this.#validator?.validate();

    if(isValidForm) {
      this.#pointDefaultState = null;
      this.#onChangeCallback(actionType, UpdateType.MAJOR, point);
    }
  };

  #pointDeleteHandler = (deletedPoint) => {
    this.#onChangeCallback(
      ActionType.DELETE_POINT,
      UpdateType.MAJOR,
      deletedPoint,
    );
  };
}
