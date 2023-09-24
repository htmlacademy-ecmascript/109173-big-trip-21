import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/filter.js';

const MessageText = {
  LOADING: 'Loading...',
  LOADING_FAILED: 'Failed to load latest route information',
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

function getTripEventsListEmptyTemplate({ currentFilter, isDataLoadingFailed }) {
  let eventMessage = '';

  if(isDataLoadingFailed) {
    eventMessage = MessageText.LOADING_FAILED;
  } else {
    eventMessage = MessageText[currentFilter] || MessageText.LOADING;
  }


  return `<p class="trip-events__msg">${eventMessage}</p>`;
}

/**
 * @param {object} templateData Объект с данными для формирования шаблона
 * @param {string} templateData.filterType Название применяемого фильтра
 */
export default class TripEventsListEmptyView extends AbstractView {
  #currentFilter = null;
  #isDataLoadingFailed = null;

  constructor({ currentFilter, isDataLoadingFailed }) {
    super();

    this.#currentFilter = currentFilter;
    this.#isDataLoadingFailed = isDataLoadingFailed;
  }

  get template() {
    return getTripEventsListEmptyTemplate({
      currentFilter: this.#currentFilter,
      isDataLoadingFailed: this.#isDataLoadingFailed,
    });
  }
}
