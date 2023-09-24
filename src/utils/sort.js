import { getDateDiff } from './utils.js';
import { DateFormats } from './const.js';
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
  [SortType.DAY]: (points) => [...points].sort((pointA, pointB) => {
    const pointBDateFrom = dayjs(pointB.dates.start, DateFormats.CHOSED_DATE);
    const pointADateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);

    // return pointBDateFrom - pointADateFrom; // По убыванию (вверху - самая поздняя точка маршрута)
    return pointADateFrom - pointBDateFrom; // По возрастанию (вверху - самая ближайшая точка маршрута)
  }),
  [SortType.EVENT]: null,
  [SortType.TIME]: (points) => [...points].sort((pointA, pointB) => {
    const pointADateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);
    const pointADateTo = dayjs(pointA.dates.end, DateFormats.CHOSED_DATE);
    const pointBDateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);
    const pointBDateTo = dayjs(pointB.dates.start, DateFormats.CHOSED_DATE);

    // return getDateDiff(pointADateFrom, pointBDateTo) - getDateDiff(pointBDateFrom, pointADateTo);
    return getDateDiff(pointBDateFrom, pointADateTo) - getDateDiff(pointADateFrom, pointBDateTo);
  }),
  [SortType.PRICE]: (points) => [...points].sort((pointA, pointB) => pointA.cost - pointB.cost),
  [SortType.OFFERS]: null,
};


export { SortType, sorts };
