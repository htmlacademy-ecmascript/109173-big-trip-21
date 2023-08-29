import { filters } from '../utils/filters.js';

function createFilters(points) {
  return Object.entries(filters).map(([filterName, filterFunc]) => ({
    name: filterName,
    checked: false,
    dataLength: points ? filterFunc(points).length : 0,
  }));
}

export { createFilters };
