import { FilterType, filters } from '../utils/filters.js';

const DEFAULT_FILTER = FilterType.EVERYTHING;

function createFilters() {
  return filters.map((filterName) => {
    const checkedState = filterName === DEFAULT_FILTER ? 'checked' : '';

    return {
      name: filterName,
      checked: checkedState,
    };
  });
}

// Если вдруг понадобится выводить количество точек, соответствующих фильтру
// function createFilters(points) {
//   return Object.entries(filters).map(([filterName, filterFunc]) => {
//     const checkedState = filterName === DEFAULT_FILTER ? 'checked' : '';

//     return {
//       name: filterName,
//       checked: checkedState,
//       dataLength: points ? filterFunc(points).length : 0,
//     };
//   });
// }

export { createFilters };
