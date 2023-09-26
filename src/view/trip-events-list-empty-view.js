import AbstractView from '../framework/view/abstract-view.js';
import { TripBoardMode } from '../utils/const.js';
import { FilterType } from '../utils/filter.js';

const MessageText = {
  LOADING: 'Loading...',
  LOADING_FAILED: 'Failed to load latest route information',
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

function getTripEventsListEmptyTemplate({ currentFilter, boardMode }) {
  let eventMessage = '';

  switch(boardMode) {
    case TripBoardMode.LOADING_FAILED: {
      eventMessage = MessageText.LOADING_FAILED;
      break;
    }

    case TripBoardMode.LOADING: {
      eventMessage = MessageText.LOADING;
      break;
    }

    default: {
      eventMessage = MessageText[currentFilter];
    }
  }

  return `<p class="trip-events__msg">${eventMessage}</p>`;
}

export default class TripEventsListEmptyView extends AbstractView {
  #currentFilter = null;
  #boardMode = null;

  constructor({ currentFilter, boardMode }) {
    super();

    this.#currentFilter = currentFilter;
    this.#boardMode = boardMode;
  }

  get template() {
    return getTripEventsListEmptyTemplate({
      currentFilter: this.#currentFilter,
      boardMode: this.#boardMode,
    });
  }
}
