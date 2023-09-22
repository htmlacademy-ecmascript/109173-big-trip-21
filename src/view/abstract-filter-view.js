import AbstractView from '../framework/view/abstract-view.js';

export default class AbstractFilterView extends AbstractView {
  _items = null;
  _onChangeCallback = null;

  constructor({items = null, onChangeCallback}) {
    super();

    if (new.target === AbstractFilterView) {
      throw new Error('Can\'t instantiate AbstractFiltersView, only concrete one.');
    }

    this._items = items;
    this._onChangeCallback = onChangeCallback;

    this.element.addEventListener('change', this._filterChangeHandler);
  }

  _filterChangeHandler = (evt) => {
    const input = evt.target;
    const filterType = input.dataset.filterType;

    this._onChangeCallback?.(filterType);
  };
}
