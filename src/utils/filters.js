import { isPastDate, isPresentDate, isFutureDate } from './utils.js';

const FilterType = {
  EVERYTHING: 'Everything',
  PAST: 'Past',
  PRESENT: 'Present',
  FUTURE: 'Future',
};

const filterss = {
  [FilterType.EVERYTHING]: (points) => points?.filter((point) => !isPastDate(point.dates.end)),
  [FilterType.PAST]: (points) => points?.filter((point) => isPastDate(point.dates.end)),
  [FilterType.PRESENT]: (points) => points?.filter((point) => isPresentDate(point.dates.end)),
  [FilterType.FUTURE]: (points) => points?.filter((point) => isFutureDate(point.dates.end)),
};


export { FilterType, filterss };
