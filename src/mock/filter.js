import { FilterType, filters } from '../utils/filter.js';

const DEFAULT_FILTER = FilterType.EVERYTHING;

function createFilters(points) {
  return Object.entries(filters).map(([filterName, filterFunc]) => {
    const checkedState = filterName === DEFAULT_FILTER ? 'checked' : '';
    const dataLength = points ? filterFunc(points).length : 0;
    const disabledState = dataLength <= 0 ? 'disabled' : '';

    return {
      name: filterName,
      checked: checkedState,
      disabled: disabledState,
    };
  });
}

export { createFilters };
