import { render } from '../framework/render.js';
import { filters } from '../utils/filter.js';
import { SortType, sorts } from '../utils/sort.js';
import { ActionType, UpdateType } from '../utils/const.js';

import TripSortView from '../view/trip-sort-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view.js.js';

const CSSClasses = {TRIP_EVENTS: '.trip-events'};
export default class TripContentPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();

  #points = null;

  /** @type {SortType[keyof SortType]} Предыдущая сортировка (по-умолчанию - DAY) */
  #currentSortType = SortType.DAY;

  constructor({ pointsModel, filterModel }) {
    this.#tripEventsContainer = document.querySelector(CSSClasses.TRIP_EVENTS); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsListView(); // Контейнер для списка точек маршрута
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const filteredPoints = filters[filterType](this.#points);

    switch(this.#currentSortType) {
      case SortType.DAY: {
        return sorts[SortType.DAY](filteredPoints);
      }

      case SortType.EVENT: {
        return sorts[SortType.EVENT](filteredPoints);
      }

      case SortType.OFFERS: {
        return sorts[SortType.OFFERS](filteredPoints);
      }

      case SortType.PRICE: {
        return sorts[SortType.PRICE](filteredPoints);
      }

      case SortType.TIME: {
        return sorts[SortType.TIME](filteredPoints);
      }
    }

    return filteredPoints;
  }

  init() {
    this.#points = [...this.#pointsModel.points]; // Копируем полученный из модели массив с точками маршрута
    this.#points = sorts[this.#currentSortType](this.#points);

    this.#renderTripBoard();
  }

  reRenderEventPoints(points) {
    this.#clearEventPoints();
    this.#renderEventPoints(points);
  }

  #renderTripBoard() {
    this.#renderSort();

    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для точек маршрута

    if (this.#points.length > 0) {
      this.#renderEventPoints(this.#points);
    } else {
      this.#renderNoPoints();
    }
  }

  #renderSort() {
    render(new TripSortView({
      onChangeCallback: this.#sortChangeHandler
    }), this.#tripEventsContainer);
  }

  #renderNoPoints() {
    render(new TripEventsListEmptyView(), this.#tripEventsListContainer.element);
  }

  // Отрисовываем события;
  #renderEventPoints(points) {
    points.forEach((point) => this.#renderEventPoint(point));
  }

  #renderEventPoint(point) {
    const pointPresenter = new TripPointPresenter({
      container: this.#tripEventsListContainer.element,
      // onChangeCallback: this.#pointChangeHandler, // Заменяем наш штатный метод на новый
      onChangeCallback: this.#viewChangeHandler,
      onBeforeEditCallback: this.#pointBeforeEditHandler,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearEventPoints() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  /** Обработчики */
  /**
   * Вью с моделью взаимодействует только через данный метод
   */
  #viewChangeHandler = (actionType, updateType, data) => {
    // Вызываем методы модели в зависимости от того, какой прилетел ActionType от пользователя (шаблона)
    // - Добавление новой точки
    // - Обновление существующей точки
    // - Удаление существующей точки

    console.log('Шаблон изменился: ', actionType, updateType, data);

    switch(actionType) {
      case ActionType.CREATE_POINT: {
        this.#pointsModel.createPoint(updateType, data);
        break;
      }

      case ActionType.UPDATE_POINT: {
        this.#pointsModel.updatePoint(updateType, data);
        break;
      }

      case ActionType.DELETE_POINT: {
        this.#pointsModel.deletePoint(updateType, data);
        break;
      }
    }
  };

  #modelChangeHandler = (updateType, pointData) => { // Отслеживаем изменение данных на сервере
    console.log('Point updated! Update type: ', updateType, ' Data: ', pointData);

    // Перерисовка точек в зависимости от типа обновления
    switch(updateType) {
      case UpdateType.PATCH: {
        // Перерисовываем только точку
        this.#pointPresenters.get(pointData.id).init(pointData); // Перерисовываем точку
        break;
      }

      case UpdateType.MINOR: {
        // Перерисовываем весь список точек
        break;
      }

      case UpdateType.MAJOR: {
        // Перерисовываем всю страницу
        break;
      }
    }
  };

  #pointChangeHandler = (changedPoint) => {
    this.#points = this.#pointsModel.updatePoint(
      UpdateType.PATCH,
      changedPoint
    );

    this.#pointPresenters.get(changedPoint.id).init(changedPoint); // Перерисовываем точку
  };

  #pointBeforeEditHandler = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortChangeHandler = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    const sortedPoints = sorts[sortType](this.#points);

    this.#currentSortType = sortType;
    this.reRenderEventPoints(sortedPoints);
  };
}
