import { filterss } from '../utils/filters.js';

function createFilters(points) {
  return Object.entries(filterss).map(([filterName, filterFunc]) => ({
    name: filterName,
    checked: false,
    dataLength: filterFunc(points)?.length
  }));
}

export { createFilters };
