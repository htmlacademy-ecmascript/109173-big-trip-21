import { createFilters } from '../mock/filter.js';

export default class FiltersModel {
  #filters = createFilters();

  get filters() {
    return this.#filters;
  }
}
