import { getDateDiff } from './utils.js';
import { DatesFormat } from './const.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const SortType = Object.freeze({
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
});

const sorts = {
  [SortType.DAY]: (points) => points?.slice().sort((pointA, pointB) => {
    const pointBDateFrom = dayjs(pointB.dates.start, DatesFormat.CHOSEN_DATE);
    const pointADateFrom = dayjs(pointA.dates.start, DatesFormat.CHOSEN_DATE);

    // return pointBDateFrom - pointADateFrom; // По убыванию (вверху - самая поздняя точка маршрута)
    return pointADateFrom - pointBDateFrom; // По возрастанию (вверху - самая ближайшая точка маршрута)
  }),
  [SortType.EVENT]: null,
  [SortType.TIME]: (points) => points?.slice().sort((pointA, pointB) => {
    const pointADateFrom = dayjs(pointA.dates.start, DatesFormat.CHOSEN_DATE);
    const pointADateTo = dayjs(pointA.dates.end, DatesFormat.CHOSEN_DATE);
    const pointBDateFrom = dayjs(pointB.dates.start, DatesFormat.CHOSEN_DATE);
    const pointBDateTo = dayjs(pointB.dates.end, DatesFormat.CHOSEN_DATE);

    const deltaA = getDateDiff(pointADateFrom, pointADateTo);
    const deltaB = getDateDiff(pointBDateFrom, pointBDateTo);

    return deltaB - deltaA;
  }),
  [SortType.PRICE]: (points) => points?.slice().sort((pointA, pointB) => pointB.cost - pointA.cost),
  [SortType.OFFERS]: null,
};

export { SortType, sorts };
