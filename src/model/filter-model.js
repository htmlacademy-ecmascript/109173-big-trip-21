import { FilterType } from '../utils/filter.js';

export default class FilterModel {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(filterType) {
    this.#filter = filterType;
  }
}
