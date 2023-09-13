import { render, remove } from '../framework/render.js';
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

  #sortComponent = null;
  #noPointsComponent = null;

  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();

  /** @type {SortType[keyof SortType]} Предыдущая сортировка (по-умолчанию - DAY) */
  #currentSortType = SortType.DAY;

  constructor({ pointsModel, filterModel }) {
    this.#tripEventsContainer = document.querySelector(CSSClasses.TRIP_EVENTS); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsListView(); // Контейнер для списка точек маршрута

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get points() {
    const currentFilter = this.#filterModel.filter;
    const filteredPoints = filters[currentFilter](this.#pointsModel.points);

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
    this.#renderTripBoard();
  }

  #renderTripBoard() {
    this.#renderSort();

    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для точек маршрута

    if (this.points.length > 0) {
      this.#renderEventPoints(this.points);
    } else {
      this.#renderNoPoints();
    }
  }

  #reRenderTripBoard() {
    this.#clearEventPoints();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    this.init();
  }

  #renderSort() {
    this.#sortComponent = new TripSortView({
      onChangeCallback: this.#sortChangeHandler
    });

    render(this.#sortComponent, this.#tripEventsContainer);
  }

  #renderNoPoints() {
    this.#noPointsComponent = new TripEventsListEmptyView();
    render(this.#noPointsComponent, this.#tripEventsListContainer.element);
  }

  #renderEventPoints(points) {
    points.forEach((point) => this.#renderEventPoint(point));
  }

  #renderEventPoint(point) {
    const pointPresenter = new TripPointPresenter({
      container: this.#tripEventsListContainer.element,
      onChangeCallback: this.#viewChangeHandler,
      onBeforeEditCallback: this.#pointBeforeEditHandler,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  // По-умолчанию - передаем пустой объект, т.к. иначе получим ошибку
  #reRenderEventPoints() {
    this.#clearEventPoints();
    this.#renderEventPoints(this.points);
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

  // Отслеживание изменения данных на сервере
  #modelChangeHandler = (updateType, pointData) => {
    switch(updateType) {
      case UpdateType.PATCH: {
        // Перерисовываем только точку
        this.#pointPresenters.get(pointData.id).init(pointData); // Перерисовываем точку
        break;
      }

      case UpdateType.MINOR: {
        // Перерисовываем весь список точек (возможно, после сабмита, т.к. может измениться дата и порядок точки в списке?)
        this.#reRenderEventPoints();
        break;
      }

      case UpdateType.MAJOR: {
        // Перерисовываем весь список точек + сбрасываем сортировку (перерисовать всю доску)
        this.#reRenderTripBoard();
        break;
      }
    }
  };

  #pointBeforeEditHandler = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortChangeHandler = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#reRenderEventPoints();
  };
}
