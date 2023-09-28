import TripSortView from '../view/trip-sort-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UpdateType } from '../utils/const.js';
import { sorts } from '../utils/sort.js';
import { capitalize } from '../utils/utils.js';

export default class TripSortPresenter {
  #sortContainer = null;
  #sortModel = null;
  #pointsModel = null;

  #sortComponent = null;
  #prevSortComponent = null;

  constructor({
    sortContainer,
    sortModel,
    pointsModel,
  }) {
    this.#sortModel = sortModel;
    this.#pointsModel = pointsModel;
    this.#sortContainer = sortContainer;

    this.#sortModel.addObserver(this.#modelChangeHandler);
    this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
  }

  get sorts() {
    return sorts;
  }

  init(remainingPointsCount = this.#pointsModel.points.length) {
    this.#prevSortComponent = this.#sortComponent;
    this.#sortComponent = new TripSortView({
      sorts: this.sorts,
      currentSort: this.#sortModel.sort,
      pointsCount: remainingPointsCount,
      onChangeCallback: this.#sortChangeHandler
    });

    if(this.#prevSortComponent === null) {
      render(this.#sortComponent, this.#sortContainer);
      return;
    }

    this.#reRenderSort();
  }

  #reRenderSort() {
    replace(this.#sortComponent, this.#prevSortComponent);
    remove(this.#prevSortComponent);
  }

  /** Обработчики */
  #modelChangeHandler = () => this.init();
  #pointsModelChangeHandler = (_, { remainingPointsCount } = {}) => {
    if(remainingPointsCount > 0) {
      return;
    }

    this.init(remainingPointsCount);
  };

  #sortChangeHandler = (sortType) => {
    if(this.#sortModel.sortType === sortType) {
      return;
    }

    const capitalizedSortName = capitalize(sortType);

    this.#sortModel.setSort(
      UpdateType.MINOR,
      capitalizedSortName
    );
  };
}
