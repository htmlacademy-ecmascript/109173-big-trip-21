import AbstractView from '../framework/view/abstract-view.js';

function createTripFilterListTemplate(filters) {
  return filters.map(({name, checked, disabled}) => {
    const loweredName = name.toLowerCase();
    const checkedState = checked ? 'checked' : '';
    const disabledState = disabled ? 'disabled' : '';

    return /*html*/`
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${loweredName}" ${checkedState} ${disabledState}>
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

  constructor(templateData) {
    super();

    this.#templateData = templateData;
  }

  get template() {
    return createTripFilterTemplate(this.#templateData);
  }
}
