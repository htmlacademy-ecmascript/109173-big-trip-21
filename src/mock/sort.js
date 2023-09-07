import { SortType, sorts } from '../utils/sort.js';

const DEFAULT_SORT = SortType.DAY;
const DISABLED_SORTS = [SortType.EVENT, SortType.OFFERS];

function createSorts() {
  return Object.keys(sorts).map((sort) => {
    const checkedState = sort === DEFAULT_SORT ? 'checked' : '';
    const disabledState = DISABLED_SORTS.includes(sort) ? 'disabled' : '';

    return {
      name: sort,
      checked: checkedState,
      disabled: disabledState
    };
  });
}


export { createSorts };
