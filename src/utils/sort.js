import { getDateDiff } from './utils.js';

const SortType = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

const sortObj = [
  {
    name: SortType.DAY,
    checked: true,
    disabled: false,
  },
  {
    name: SortType.EVENT,
    checked: false,
    disabled: true,
  },
  {
    name: SortType.TIME,
    checked: false,
    disabled: false,
  },
  {
    name: SortType.PRICE,
    checked: false,
    disabled: false,
  },
  {
    name: SortType.OFFERS,
    checked: false,
    disabled: true,
  },
];

const sorts = {
  [SortType.DAY]: (points) => points?.sort((pointA, pointB) => pointA.dates.start - pointB.dates.start),
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points?.sort((pointA, pointB) => getDateDiff(pointA.dates.start, pointA.dates.end) - getDateDiff(pointB.dates.start, pointB.dates.end)),
  [SortType.PRICE]: (points) => points?.sort((pointA, pointB) => pointA.cost - pointB.cost),
  [SortType.OFFERS]: (points) => points,
};


export { SortType, sortObj, sorts };
