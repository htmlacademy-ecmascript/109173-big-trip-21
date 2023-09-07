import { render } from '../framework/render.js';
import { updateItem } from '../utils/utils.js';
import { FilterType } from '../utils/filters.js';
import { SortType, sorts } from '../utils/sort.js';
import TripSortView from '../view/trip-sort-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view.js';

// Модели
import PointsModel from '../model/points-model.js';

const CSSClasses = {TRIP_EVENTS: '.trip-events'};
export default class TripContentPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointsModel = null;
  #points = null;
  #pointPresenters = new Map();
  /** @type {FilterType[keyof FilterType]} */
  #previousFilterType = FilterType.EVERYTHING; // Предыдущий выбранный фильтр (по-умолчанию - EVERYTHING);
  /** @type {SortType[keyof SortType]} Предыдущая сортировка (по-умолчанию - DAY) */
  #previousSortType = SortType.DAY;

  constructor() {
    this.#tripEventsContainer = document.querySelector(CSSClasses.TRIP_EVENTS); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsListView(); // Контейнер для списка точек маршрута
    this.#pointsModel = new PointsModel(); // Модель для получения данных о точках маршрута
  }

  init() {
    this.#points = [...this.#pointsModel.points]; // Копируем полученный из модели массив с точками маршрута
    this.#points = sorts[this.#previousSortType](this.#points);

    this.#renderTripBoard();
  }

  get points() {
    return this.#points;
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
    console.log(changedPoint);
    this.#points = updateItem(this.#points, changedPoint); // Обновляем информацию о точке в общем списке
    this.#pointPresenters.get(changedPoint.id).init(changedPoint); // Перерисовываем точку
  };

  #pointBeforeEditHandler = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  // #filterChangeHandler = (filterType) => {
  //   const filterName = upperCaseFirst(filterType);

  //   // Исключаем клик по одному и тому же фильтру
  //   if (this.#previousFilterType === filterName) {
  //     return;
  //   }

  //   const filteredPoints = filters[filterName](this.points);

  //   this.#previousFilterType = filterType;
  //   this.reRenderEventPoints(filteredPoints);
  // };

  #sortChangeHandler = (sortType) => {
    if(this.#previousSortType === sortType) {
      return;
    }

    const sortedPoints = sorts[sortType](this.#points);

    this.#previousSortType = sortType;
    this.reRenderEventPoints(sortedPoints);
  };
}
