import { getDateDiff } from './utils.js';

const SortType = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

const sorts = {
  [SortType.DAY]: (points) => points?.slice().sort((pointA, pointB) => pointA.dates.start - pointB.dates.start),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points?.slice().sort((pointA, pointB) => getDateDiff(pointA.dates.start, pointA.dates.end) - getDateDiff(pointB.dates.start, pointB.dates.end)),
  [SortType.PRICE]: (points) => points?.slice().sort((pointA, pointB) => pointA.cost - pointB.cost),
  [SortType.OFFERS]: (points) => points,
};


export { SortType, sorts };
