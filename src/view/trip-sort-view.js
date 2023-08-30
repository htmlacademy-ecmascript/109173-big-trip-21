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
        <input id="sort-${loweredSortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${loweredSortType}" ${checkedState} ${disabledState}>
        <label class="trip-sort__btn" data-sort-type="${name}" for="sort-${loweredSortType}">${name}</label>
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
    this.element.addEventListener('click', this.#pointSortHandler);
  }

  get template() {
    return createTripSortTemplate();
  }

  #pointSortHandler = (evt) => {
    const target = evt.target;
    const parent = target.closest(CSSClases.SORT_BTN_CONTAINER);
    const sortInput = parent.querySelector(CSSClases.SORT_BTN_INPUT);

    if (!target.className.includes(CSSClases.SORT_BTN.slice(1)) ||
        !parent ||
        sortInput.disabled) {
      return;
    }

    const sortType = evt.target.dataset.sortType;

    if(this.#pointSortCallback) {
      this.#pointSortCallback(sortType);
    }
  };
}
