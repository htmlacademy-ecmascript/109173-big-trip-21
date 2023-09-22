import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/filter.js';

const MessageText = {
  LOADING: 'Loading...',
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

function getTripEventsListEmptyTemplate({ currentFilter }) {
  const eventMessage = MessageText[currentFilter] || MessageText.LOADING;

  return `<p class="trip-events__msg">${eventMessage}</p>`;
}

/**
 * @param {object} templateData Объект с данными для формирования шаблона
 * @param {string} templateData.filterType Название применяемого фильтра
 */
export default class TripEventsListEmptyView extends AbstractView {
  #currentFilter = null;

  constructor({ currentFilter }) {
    super();

    this.#currentFilter = currentFilter;
  }

  get template() {
    return getTripEventsListEmptyTemplate({ currentFilter: this.#currentFilter });
  }
}
