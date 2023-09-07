import { createFilters } from '../mock/filter.js';
import { FilterType } from '../utils/filters';

const DEFAULT_FILTER = FilterType.EVERYTHING;
export default class FiltersModel {
  #currentFilter = FilterType[DEFAULT_FILTER];
  #filters = createFilters();

  get filters() {
    return this.#filters;
  }

  set filter(filterType) {
    this.#currentFilter = filterType;
  }

  get filter() {
    return FilterType[this.#currentFilter];
  }
}
