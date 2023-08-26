const FilterType = {
  EVERYTHING: 'Everything',
  PAST: 'Past',
  PRESENT: 'Present',
  FUTURE: 'Future',
};

const filters = {
  [FilterType.EVERYTHING]: (points) => {},
  [FilterType.PAST]: (points) => {},
  [FilterType.PRESENT]: (points) => {},
  [FilterType.FUTURE]: (points) => {},
};


export { FilterType, filters };
