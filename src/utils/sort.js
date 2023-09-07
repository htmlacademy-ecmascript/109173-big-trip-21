import { getDateDiff } from './utils.js';

const SortType = Object.freeze({
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
});

const sorts = {
  [SortType.DAY]: (points) => [...points].sort((pointA, pointB) => pointB.dates.start - pointA.dates.start),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => [...points].slice().sort((pointA, pointB) => getDateDiff(pointB.dates.start, pointA.dates.end) - getDateDiff(pointA.dates.start, pointB.dates.end)),
  [SortType.PRICE]: (points) => [...points].slice().sort((pointA, pointB) => pointB.cost - pointA.cost),
  [SortType.OFFERS]: (points) => points,
};


export { SortType, sorts };
