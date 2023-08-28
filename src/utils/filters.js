import { isPastDate, isPresentDate, isFutureDate } from './utils.js';

const FilterType = {
  EVERYTHING: 'Everything',
  PAST: 'Past',
  PRESENT: 'Present',
  FUTURE: 'Future',
};

const filters = {
  // [FilterType.EVERYTHING]: (points) => points?.filter((point) => !isPastDate(point.dates.end)),
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points?.filter((point) => isPastDate(point.dates.end)),
  [FilterType.PRESENT]: (points) => points?.filter((point) => isPresentDate(point.dates.start, point.dates.end)),
  [FilterType.FUTURE]: (points) => points?.filter((point) => isFutureDate(point.dates.start)),
};


export { FilterType, filters };
