import { DateFormats, getDateDiff } from './utils.js';
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
  [SortType.DAY]: (points) => [...points].sort((pointA, pointB) => dayjs(pointB.dates.start, DateFormats.CHOSED_DATE) - dayjs(pointA.dates.start, DateFormats.CHOSED_DATE)),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => [...points].slice().sort((pointA, pointB) => {
    const pointADateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);
    const pointADateTo = dayjs(pointA.dates.end, DateFormats.CHOSED_DATE);
    const pointBDateFrom = dayjs(pointA.dates.start, DateFormats.CHOSED_DATE);
    const pointBDateTo = dayjs(pointB.dates.start, DateFormats.CHOSED_DATE);

    return getDateDiff(pointBDateFrom, pointADateTo) - getDateDiff(pointADateFrom, pointBDateTo);
  }),
  [SortType.PRICE]: (points) => [...points].slice().sort((pointA, pointB) => pointB.cost - pointA.cost),
  [SortType.OFFERS]: (points) => points,
};


export { SortType, sorts };
