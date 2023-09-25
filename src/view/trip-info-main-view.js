import AbstractView from '../framework/view/abstract-view.js';
import { normalizeDate } from '../utils/utils.js';
import { DatesFormat } from '../utils/const.js';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function createTripInfoMainTemplate({ pointsInfo }) {
  let destinationsStr = '&mdash; ... &mdash;';
  let datesStr = '... &mdash; ...';

  if(pointsInfo.length <= 0) {
    return '';
  }

  const startPoint = pointsInfo[0];
  const endPoint = pointsInfo[pointsInfo.length - 1];
  const startDestination = startPoint.destination;
  const endDestination = endPoint.destination;

  if(pointsInfo[0].destination) {
    switch(Boolean(pointsInfo.length)) {
      case (pointsInfo.length > 3): {
        destinationsStr = `${startDestination} ${destinationsStr} ${endDestination}`;
        break;
      }

      case (pointsInfo.length === 2): {
        destinationsStr = `${startDestination} &mdash; ${endDestination}`;
        break;
      }

      case (pointsInfo.length === 1): {
        destinationsStr = startDestination;
        break;
      }

      default: {
        if(startDestination) {
          destinationsStr = Object.values(pointsInfo).map((pointInfo) => pointInfo.destination).join(' &mdash; ');
        }
      }
    }
  }

  const pathDateFrom = dayjs(startPoint.dateFrom, DatesFormat.PATH);
  const pathDateTo = dayjs(endPoint.dateTo, DatesFormat.PATH);
  // const dateToFormat = (pathDateFrom.isSame(pathDateTo, 'year') && pathDateFrom.isSame(pathDateTo, 'month'))
  //   ? DatesFormat.DAY
  //   : DatesFormat.FOR_HEAD_DATES;

  datesStr = `${normalizeDate(pathDateFrom, DatesFormat.FOR_HEAD_DATES, '...')} &mdash; ${normalizeDate(pathDateTo, DatesFormat.FOR_HEAD_DATES, '...')}`;

  return /*html*/`
    <div class="trip-info__main">
        <h1 class="trip-info__title">${destinationsStr}</h1>

        <p class="trip-info__dates">${datesStr}</p>
    </div>`;
}

export default class TripInfoMainView extends AbstractView {
  #pointsInfo = null;
  constructor({ pointsInfo }) {
    super();

    this.#pointsInfo = pointsInfo;
  }

  get template() {
    return createTripInfoMainTemplate({ pointsInfo: this.#pointsInfo });
  }
}
