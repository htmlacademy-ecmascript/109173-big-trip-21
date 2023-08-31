import AbstractView from '../framework/view/abstract-view.js';

function createTripFilterListTemplate(filters) {
  return filters.map(({name, checked, dataLength}) => {
    const loweredName = name.toLowerCase();
    const checkedState = checked ? 'checked' : '';
    const disabledState = dataLength <= 0 ? 'disabled' : '';
    // const pointsCount = dataLength > 0 ? `( ${dataLength} )` : '';

    return /*html*/`
      <div class="trip-filters__filter">
        <input id="filter-${loweredName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${loweredName}" ${checkedState} ${disabledState}>
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

export default class TripFilterView extends AbstractView {
  #templateData = null;
  #filtersClickCallback = null;

  constructor(templateData) {
    super();

    this.#templateData = templateData;
    this.#filtersClickCallback = templateData.filtersClickCallback;
    this.element.addEventListener('change', this.#clickFilterBtnHandler);
  }

  get template() {
    return createTripFilterTemplate(this.#templateData.filters);
  }

  #clickFilterBtnHandler = (evt) => {
    const input = evt.target;
    const filterType = input.value;

    this.#filtersClickCallback(filterType);
  };
}
