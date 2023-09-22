import { isPastDate, isPresentDate, isFutureDate } from './utils.js';

const FilterType = Object.freeze({
  EVERYTHING: 'Everything',
  PAST: 'Past',
  PRESENT: 'Present',
  FUTURE: 'Future',
});

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points?.slice()
    .filter((point) => isPastDate(point.dates.end)),
  [FilterType.PRESENT]: (points) => points?.slice()
    .filter((point) => isPresentDate(point.dates.start, point.dates.end)),
  [FilterType.FUTURE]: (points) => points?.slice()
    .filter((point) => isFutureDate(point.dates.start)),
};


export { FilterType, filters };
