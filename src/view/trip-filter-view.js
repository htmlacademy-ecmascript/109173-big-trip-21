import AbstractFiltersView from './abstract-filters-view.js';

function createTripFilterListTemplate(filters) {
  return filters.map(({name, checked, disabled}) => {
    const loweredName = name.toLowerCase();
    // const pointsCount = dataLength > 0 ? `( ${dataLength} )` : '';

    return /*html*/`
      <div class="trip-filters__filter">
        <input id="filter-${loweredName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" data-filter-type="${loweredName}" value="${loweredName}" ${checked} ${disabled}>
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

export default class TripFilterView extends AbstractFiltersView {
  get template() {
    return createTripFilterTemplate(this._items);
  }
}
