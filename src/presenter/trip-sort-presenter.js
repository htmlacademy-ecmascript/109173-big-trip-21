import TripSortView from '../view/trip-sort-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UpdateType } from '../utils/const.js';
import { sorts } from '../utils/sort.js';
import { upperCaseFirst } from '../utils/utils.js';

export default class TripSortPresenter {
  #sortContainer = null;
  #sortModel = null;
  #filterModel = null;
  #pointsModel = null;

  #sortComponent = null;
  #currentSort = null;
  #previousSortComponent = null;

  constructor({
    sortContainer,
    sortModel,
    filterModel,
    pointsModel,
  }) {
    this.#sortModel = sortModel;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#sortContainer = sortContainer;
    this.#currentSort = this.#sortModel.sort;

    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get sorts() {
    return sorts;
  }

  init() {
    this.#previousSortComponent = this.#sortComponent;
    this.#sortComponent = new TripSortView({
      sorts: this.sorts,
      currentSort: this.#currentSort,
      onChangeCallback: this.#sortChangeHandler
    });

    if(this.#previousSortComponent === null) {
      render(this.#sortComponent, this.#sortContainer);
      return;
    }

    this.#reRenderSort();
  }

  #reRenderSort() {
    replace(this.#sortComponent, this.#previousSortComponent);
    remove(this.#previousSortComponent);
  }

  /** Обработчики */
  // Отслеживание изменения данных на сервере
  #modelChangeHandler = (updateType) => {
    switch(updateType) {
      case UpdateType.MAJOR: {
        // TODO: Как получить количество точек так, после сортировки?
        this.init();
        break;
      }
    }
  };

  #sortChangeHandler = (sortType) => {
    if(this.#sortModel.sortType === sortType) {
      return;
    }

    const capitalizedSortName = upperCaseFirst(sortType);

    this.#sortModel.setSort(
      UpdateType.MAJOR,
      capitalizedSortName
    );
  };
}