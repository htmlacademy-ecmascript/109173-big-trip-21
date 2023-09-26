import TripFilterView from '../view/trip-filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { capitalize } from '../utils/utils.js';
import { UpdateType } from '../utils/const.js';
import { FilterType, filters } from '../utils/filter.js';

export default class TripFilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;
  #previousFilterComponent = null;

  constructor({
    filterContainer,
    filterModel,
    pointsModel,
  }) {
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterContainer = filterContainer;

    this.#filterModel.addObserver(this.#modelChangeHandler);
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
      currentFilter: this.#filterModel.filter,
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
  #modelChangeHandler = () => this.init();
  #pointsModelChangeHandler = () => this.init();

  #filterChangeHandler = (filterType) => {
    if(this.#filterModel.filter === filterType) {
      return;
    }

    const capitalizedFilterName = capitalize(filterType);

    this.#filterModel.setFilter(
      UpdateType.MINOR,
      capitalizedFilterName
    );
  };
}
