import { filters } from '../utils/filters.js';

function createFilters(points) {
  return Object.entries(filters).map(([filterName, filterFunc]) => ({
    name: filterName,
    checked: false,
    dataLength: filterFunc(points)?.length
  }));
}

export { createFilters };
