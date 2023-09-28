import AbstractView from '../framework/view/abstract-view.js';
import { normalizeDate } from '../utils/utils.js';
import { DatesFormat } from '../utils/const.js';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const Delimiter = {
  DASH: '&mdash;',
  DOTS: '...'
};

function createTripInfoMainTemplate({ destinationsAndDates }) {
  let destinationsTemplate = `${Delimiter.DASH} ${Delimiter.DOTS} ${Delimiter.DASH}`;
  let datesTemplate = `${Delimiter.DOTS} ${Delimiter.DASH} ${Delimiter.DOTS}`;

  if(destinationsAndDates.length <= 0) {
    return '';
  }

  const startPoint = destinationsAndDates[0];
  const endPoint = destinationsAndDates[destinationsAndDates.length - 1];
  const startDestination = startPoint.destination;
  const endDestination = endPoint.destination;

  if(destinationsAndDates[0].destination) {
    switch(Boolean(destinationsAndDates.length)) {
      case (destinationsAndDates.length > 3): {
        destinationsTemplate = `${startDestination} ${destinationsTemplate} ${endDestination}`;
        break;
      }

      case (destinationsAndDates.length === 2): {
        destinationsTemplate = `${startDestination} ${Delimiter.DASH} ${endDestination}`;
        break;
      }

      case (destinationsAndDates.length === 1): {
        destinationsTemplate = startDestination;
        break;
      }

      default: {
        if(startDestination) {
          destinationsTemplate = Object.values(destinationsAndDates)
            .map((pointInfo) => pointInfo.destination).join(` ${Delimiter.DASH} `);
        }
      }
    }
  }

  const pathDateFrom = dayjs(startPoint.dateFrom, DatesFormat.PATH);
  const pathDateTo = dayjs(endPoint.dateTo, DatesFormat.PATH);

  datesTemplate = `${normalizeDate(pathDateFrom, DatesFormat.FOR_HEAD_DATES, Delimiter.DOTS)}
    &mdash; ${normalizeDate(pathDateTo, DatesFormat.FOR_HEAD_DATES, Delimiter.DOTS)}`;

  return /*html*/`
    <div class="trip-info__main">
        <h1 class="trip-info__title">${destinationsTemplate}</h1>

        <p class="trip-info__dates">${datesTemplate}</p>
    </div>`;
}

export default class TripInfoMainView extends AbstractView {
  #destinationsAndDates = null;
  constructor({ destinationsAndDates }) {
    super();

    this.#destinationsAndDates = destinationsAndDates;
  }

  get template() {
    return createTripInfoMainTemplate({ destinationsAndDates: this.#destinationsAndDates });
  }
}
