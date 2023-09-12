import AbstractFilterView from './abstract-filter-view.js';
import { createSorts } from '../mock/sort.js';

function createTripSortItemsTemplate() {
  const sorts = createSorts();
  return sorts.map(({name, checked, disabled}) => {
    const loweredSortType = name.toLowerCase();

    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${loweredSortType}">
        <input id="sort-${loweredSortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-filter-type="${name}" value="sort-${loweredSortType}" ${checked} ${disabled}>
        <label class="trip-sort__btn" for="sort-${loweredSortType}">${name}</label>
      </div>
    `;
  }).join('');
}

function createTripSortTemplate() {
  const sortItemsTemplate = createTripSortItemsTemplate();
  return /*html*/`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`;
}
export default class TripSortView extends AbstractFilterView {
  get template() {
    return createTripSortTemplate();
  }
}
