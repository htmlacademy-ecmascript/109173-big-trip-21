import AbstractView from '../framework/view/abstract-view.js';
import { DateFormats } from '../utils/utils.js';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function createTripInfoMainTemplate({ pointsInfo }) {
  let destinationsStr = '&mdash; ... &mdash;';
  let datesStr = '... &mdash; ...';

  if(pointsInfo.length > 0) {
    const startPoint = pointsInfo[0];
    const endPoint = pointsInfo[pointsInfo.length - 1];

    // TODO: Можно ли исправить на switch?
    if(pointsInfo.length > 3) {
      destinationsStr = `${startPoint.destination} ${destinationsStr} ${endPoint.destination}`;
    } else if(pointsInfo.length === 2) {
      destinationsStr = `${startPoint.destination} &mdash; ${endPoint.destination}`;
    } else {
      destinationsStr = Object.values(pointsInfo).map((pointInfo) => pointInfo.destination).join('&mdash;');
    }

    const pathDateFrom = dayjs(startPoint.dateFrom, DateFormats.PATH);
    const pathDateTo = dayjs(endPoint.dateTo, DateFormats.PATH);
    const dateToFormat = (pathDateFrom.isSame(pathDateTo, 'year') && pathDateFrom.isSame(pathDateTo, 'month')) ? DateFormats.DAY : DateFormats.FOR_POINT;

    datesStr = `${pathDateFrom.format(DateFormats.FOR_POINT)} &mdash; ${pathDateTo.format(dateToFormat)}`;
  }


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
