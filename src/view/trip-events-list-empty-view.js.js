import AbstractView from '../framework/view/abstract-view.js';

const MessageText = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

function getTripEventsListEmptyTemplate({filterType = 'EVERYTHING'}) {
  const eventMessage = MessageText[filterType] || MessageText.EVERYTHING;

  return `<p class="trip-events__msg">${eventMessage}</p>`;
}

/**
 * templateData {object} Объект с данными для формирования шаблона
 */
export default class TripEventsListEmpty extends AbstractView {
  #templateData = null;

  constructor(templateData = {}) {
    super();

    this.#templateData = templateData;
  }

  get template() {
    return getTripEventsListEmptyTemplate(this.#templateData);
  }
}
