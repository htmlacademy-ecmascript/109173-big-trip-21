import { FilterType } from '../utils/filter.js';
import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filterType, rerender) {
    this.#filter = filterType;
    this._notify(updateType, { filterType, rerender });
  }
}
