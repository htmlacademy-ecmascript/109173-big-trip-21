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

    return pointBDateFrom - pointADateFrom;
  }),
  [SortType.EVENT]: null,
  [SortType.TIME]: (points) => [...points].sort((pointA, pointB) => {
    const pointADateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);
    const pointADateTo = dayjs(pointA.dates.end, DateFormats.CHOSED_DATE);
    const pointBDateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);
    const pointBDateTo = dayjs(pointB.dates.start, DateFormats.CHOSED_DATE);

    return getDateDiff(pointADateFrom, pointBDateTo) - getDateDiff(pointBDateFrom, pointADateTo);
  }),
  [SortType.PRICE]: (points) => [...points].sort((pointA, pointB) => pointB.cost - pointA.cost),
  [SortType.OFFERS]: null,
};


export { SortType, sorts };
