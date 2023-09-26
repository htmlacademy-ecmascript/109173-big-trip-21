import AbstractView from '../framework/view/abstract-view.js';

function createTripSortItemsTemplate({ sorts, currentSort }) {
  return Object.entries(sorts).map(([ sort, sortFunc ]) => {
    const loweredSortType = sort.toLowerCase();
    const checkedState = (sort === currentSort) ? 'checked' : '';
    const disabledState = (sortFunc === null) ? 'disabled' : '';

    return /*html*/`
      <div class="trip-sort__item  trip-sort__item--${loweredSortType}">
        <input
          id="sort-${loweredSortType}"
          class="trip-sort__input  visually-hidden"
          type="radio"
          name="trip-sort"
          data-sort-type="${sort}"
          value="sort-${loweredSortType}"
          ${checkedState}
          ${disabledState}
        >
        <label class="trip-sort__btn" for="sort-${loweredSortType}">${sort}</label>
      </div>
    `;
  }).join('');
}

function createTripSortTemplate({ sorts, currentSort, pointsCount }) {
  if (pointsCount < 0) {
    return '';
  }

  const sortItemsTemplate = createTripSortItemsTemplate({ sorts, currentSort });

  return /*html*/`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${ sortItemsTemplate }
    </form>`;
}
export default class TripSortView extends AbstractView {
  #sorts = null;
  #currentSort = null;
  #pointsCount = null;
  #onChangeCallback = null;

  get template() {
    return createTripSortTemplate({
      sorts: this.#sorts,
      currentSort: this.#currentSort,
      pointsCount: this.#pointsCount
    });
  }

  constructor({
    sorts,
    currentSort,
    pointsCount,
    onChangeCallback
  }) {
    super();

    this.#sorts = sorts;
    this.#currentSort = currentSort;
    this.#pointsCount = pointsCount;
    this.#onChangeCallback = onChangeCallback;

    if(this.#pointsCount > 0) {
      this.element.addEventListener('change', this.#sortChangeHandler);
    }
  }

  #sortChangeHandler = (evt) => {
    const input = evt.target;
    const sortType = input.dataset.sortType;

    this.#onChangeCallback?.(sortType);
  };
}
