import { SortType } from '../utils/sort.js';
import Observable from '../framework/observable.js';

export default class SortModel extends Observable {
  #sort = SortType.DAY;

  get sort() {
    return this.#sort;
  }

  setSort(updateType, sortType) {
    this.#sort = sortType;
    this._notify(updateType, sortType);
  }
}
