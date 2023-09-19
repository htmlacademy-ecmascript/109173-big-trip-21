import TripFilterView from '../view/trip-filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { upperCaseFirst } from '../utils/utils.js';
import { UpdateType } from '../utils/const.js';
import { FilterType, filters } from '../utils/filter.js';

export default class TripFilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;
  #currentFilter = null;
  #previousFilterComponent = null;

  constructor({
    filterContainer,
    filterModel,
    pointsModel,
  }) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterContainer = filterContainer;
    this.#currentFilter = this.#filterModel.filter;

    this.#filterModel.addObserver(this.#filterModelChangeHandler);
    this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      name: type,
      dataLength: filters[type](points).length
    }));
  }

  init() {
    this.#previousFilterComponent = this.#filterComponent;
    this.#filterComponent = new TripFilterView({
      filters: this.filters,
      currentFilter: this.#currentFilter,
      onFilterChangeCallback: this.#filterChangeHandler
    });

    if(this.#previousFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    this.#reRenderFilter();
  }

  #reRenderFilter() {
    replace(this.#filterComponent, this.#previousFilterComponent);
    remove(this.#previousFilterComponent);
  }

  /** Обработчики */
  // Отслеживание изменения данных на сервере
  #pointsModelChangeHandler = (updateType, { remainingPointsCount }) => {
    switch(updateType) {
      case UpdateType.MAJOR: { // Отключаем фильтры, если не осталось точек
        if(remainingPointsCount <= 0) {
          this.init();
        }
        break;
      }
    }
  };

  #filterModelChangeHandler = (updateType, { rerender }) => {
    switch(updateType) {
      case UpdateType.MAJOR: { // Отключаем фильтры, если не осталось точек
        if(rerender) {
          this.init();
        }
        break;
      }
    }
  };

  #filterChangeHandler = (filterType) => {
    if(this.#filterModel.filter === filterType) {
      return;
    }

    const capitalizedFilterName = upperCaseFirst(filterType);

    this.#filterModel.setFilter(
      UpdateType.MAJOR,
      capitalizedFilterName
    );
  };
}
