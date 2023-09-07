import { render, replace, remove } from '../framework/render.js';
import { DateFormats, isEscKey } from '../utils/utils.js';
import { getOffersByType, getDestinations} from '../mock/way-point.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class TripPointPresenter {
  #point = null;
  #pointsContainer = null;

  #pointComponent = null;
  #editPointComponent = null;

  #prevPointComponent = null;
  #prevEditPointComponent = null;
  #pointIsEditing = false;

  #onChangeCallback = null;
  #onBeforeEditCallback = null;
  #onTypeChangeCallback = null;

  constructor(pointPresenterData) {
    this.#pointsContainer = pointPresenterData.container;
    this.#onChangeCallback = pointPresenterData.onChangeCallback;
    this.#onBeforeEditCallback = pointPresenterData.onBeforeEditCallback;
  }

  init(point) {
    this.#point = point;

    const pointData = {
      point: this.#point,
      destinations: getDestinations(),
      offers: getOffersByType(this.#point.type),
    };

    // Компоненты предыдущей точки маршрута
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditPointComponent = this.#editPointComponent;

    // Компоненты текущей точки маршрута
    this.#pointComponent = new TripEventsListItemView({
      ...pointData,
      onEditCallback: this.#pointEditHandler,
      onFavoriteCallback: this.#favoriteClickHandler,
    }); // Точка маршрута

    this.#editPointComponent = new EditPointView({
      ...pointData,
      onFinishEditCallback: this.#pointFinishEditHandler,
      onSubmitCallback: this.#pointSubmitHandler,
      onTypeChangeCallback: this.#pointTypeChangeHandler,
      onDatesChangeCallback: this.#pointDatesChangeHandler,
    }); // Форма редактирования точки маршрута

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

  #documentKeyDownHandler = (evt) => {
    if (isEscKey(evt) && this.#pointIsEditing) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }

    document.removeEventListener('keydown', this.#documentKeyDownHandler);
  };

  /** Обработчики */
  #pointEditHandler = () => {
    document.addEventListener('keydown', this.#documentKeyDownHandler);

    this.#onBeforeEditCallback(); // Вызываем колбэк общего презентера (для закрытия всех форм редактирования перед открытием новой)
    this.#replacePointToForm();
  };

  #pointFinishEditHandler = () => { // Пока Callback такой же, как и для отправки формы, но, наверняка дальше они будут разными
    this.#replaceFormToPoint();
  };

  #favoriteClickHandler = (isFavorite) => {
    this.#point.isFavorite = isFavorite;
    this.#onChangeCallback(this.#point);
  };

  #pointTypeChangeHandler = (pointType) => {
    const newOffers = getOffersByType(pointType).offers;

    this.#point.type = pointType;
    this.#point.offers = newOffers;
    this.#onChangeCallback(this.#point);
  };

  #pointDatesChangeHandler = (newDates) => {
    this.#point.dates = newDates;
    this.#onChangeCallback(this.#point);
  };

  #pointSubmitHandler = () => {
    this.#replaceFormToPoint();
  };
}
