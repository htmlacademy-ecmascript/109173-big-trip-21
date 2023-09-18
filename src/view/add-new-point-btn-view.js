import AbstractView from '../framework/view/abstract-view.js';

function createNewPointBtnTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class AddNewPointBtnView extends AbstractView{
  #onAddNewPointCallback = null;

  constructor({ onAddNewPointCallback }) {
    super();

    this.#onAddNewPointCallback = onAddNewPointCallback;
    this.element.addEventListener('click', this.#addNewPointBtnClickHandler);
  }

  get template() {
    return createNewPointBtnTemplate();
  }

  #addNewPointBtnClickHandler = () => {
    this.#onAddNewPointCallback?.();
  };
}
