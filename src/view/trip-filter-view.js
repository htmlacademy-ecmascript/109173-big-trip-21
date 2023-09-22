import AbstractView from '../framework/view/abstract-view.js';

function createTripFilterListTemplate({ filters, currentFilter }) {
  return filters.map(({name, dataLength}) => {
    const loweredName = name.toLowerCase();
    const disabledState = (dataLength <= 0) ? 'disabled' : '';
    const checkedState = (name === currentFilter) ? 'checked' : '';

    return /*html*/`
      <div class="trip-filters__filter">
        <input
          id="filter-${loweredName}"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          data-filter-type="${loweredName}"
          value="${loweredName}"
          ${checkedState}
          ${disabledState}>
        <label class="trip-filters__filter-label" for="filter-${loweredName}">${name}</label>
      </div>`;
  }).join('');
}

function createTripFilterTemplate(filters) {
  const filtersListTemplate = createTripFilterListTemplate(filters);
  return /*html*/`
    <form class="trip-filters" action="#" method="get">
      ${filtersListTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class TripFilterView extends AbstractView{
  #filters = null;
  #currentFilter = null;
  #onFilterChangeCallback = null;

  constructor({
    filters,
    currentFilter,
    onFilterChangeCallback
  }) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFilterChangeCallback = onFilterChangeCallback;

    this._restoreHandlers();
  }

  get template() {
    return createTripFilterTemplate({
      filters: this.#filters,
      currentFilter: this.#currentFilter,
    });
  }

  _restoreHandlers() {
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  #filterChangeHandler = (evt) => {
    const target = evt.target;
    const filterType = target.value;

    this.#onFilterChangeCallback?.(filterType);
  };
}
