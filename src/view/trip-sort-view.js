import AbstractView from '../framework/view/abstract-view.js';
import { sortObj } from '../utils/sort.js';

const CSSClases = {SORT_BTN: '.trip-sort__btn', SORT_BTN_CONTAINER: '.trip-sort__item ', SORT_BTN_INPUT: '.trip-sort__input'};

function createTripSortItemsTemplate() {
  return sortObj.map(({name, checked, disabled}) => {
    const loweredSortType = name.toLowerCase();
    const checkedState = checked ? 'checked' : '';
    const disabledState = disabled ? 'disabled' : '';

    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${loweredSortType}">
        <input id="sort-${loweredSortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-sort-type="${name}" value="sort-${loweredSortType}" ${checkedState} ${disabledState}>
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
export default class TripSortView extends AbstractView {
  #templateData = null;
  #pointSortCallback = null;

  constructor(templateData) {
    super();
    this.#templateData = templateData;
    this.#pointSortCallback = templateData.pointSortCallback;
    this.element.addEventListener('change', this.#pointSortHandler);
  }

  get template() {
    return createTripSortTemplate();
  }

  #pointSortHandler = (evt) => {
    const input = evt.target;
    const sortType = input.dataset.sortType;

    if(this.#pointSortCallback) {
      this.#pointSortCallback(sortType);
    }
  };
}
