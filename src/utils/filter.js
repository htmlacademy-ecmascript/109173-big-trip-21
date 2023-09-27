import { isPastDate, isPresentDate, isFutureDate } from './utils.js';

const FilterType = Object.freeze({
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past',
});

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points?.slice()
    .filter((point) => isFutureDate(point.dates.start)),
  [FilterType.PRESENT]: (points) => points?.slice()
    .filter((point) => isPresentDate(point.dates.start, point.dates.end)),
  [FilterType.PAST]: (points) => points?.slice()
    .filter((point) => isPastDate(point.dates.end)),
};


export { FilterType, filters };
