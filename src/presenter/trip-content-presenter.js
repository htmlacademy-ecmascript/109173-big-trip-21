import { render } from '../framework/render.js';
import { filters } from '../utils/filter.js';
import { SortType, sorts } from '../utils/sort.js';
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
  #previousSortType = SortType.DAY;

  constructor({ pointsModel, filterModel }) {
    this.#tripEventsContainer = document.querySelector(CSSClasses.TRIP_EVENTS); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsListView(); // Контейнер для списка точек маршрута
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const filteredPoints = filters[filterType](this.#points);

    return filteredPoints;
  }

  init() {
    this.#points = [...this.#pointsModel.points]; // Копируем полученный из модели массив с точками маршрута
    this.#points = sorts[this.#previousSortType](this.#points);

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
      onChangeCallback: this.#pointChangeHandler,
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
  #pointChangeHandler = (changedPoint) => {
    this.#points = this.#pointsModel.updatePoint(changedPoint); // Обновляем информацию о точке в общем списке
    this.#pointPresenters.get(changedPoint.id).init(changedPoint); // Перерисовываем точку
  };

  #pointBeforeEditHandler = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortChangeHandler = (sortType) => {
    if(this.#previousSortType === sortType) {
      return;
    }

    const sortedPoints = sorts[sortType](this.#points);

    this.#previousSortType = sortType;
    this.reRenderEventPoints(sortedPoints);
  };
}
