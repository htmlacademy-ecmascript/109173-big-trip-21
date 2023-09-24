import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { findObjectByID, removeChars } from '../utils/utils.js';
import { POINT_TYPES, FLATPIKR_SETTINGS, DateFormats } from '../utils/const.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const OPTIONS_LOADING_FAILED_MESSAGE = 'Sorry... Destinations/Offers wasn`t loaded fully.<br> Please, reload this page or try again later.';
const PlaceholderText = {
  DESTINATION: 'Destination name',
  PRICE: 'Price',
  DATE_FROM: 'Date from',
  DATE_TO: 'Date to'
};
const BtnText = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
  SAVING: 'Saving...',
  DELETE: 'Delete',
  DELETING: 'Deleting...'
};

const CSSIDs = {
  DEFAULT_POINT_TYPE: '#event-type-toggle-1',
  DATE_TIME_START: '#event-start-time-1',
  DATE_TIME_END: '#event-end-time-1',
};

const CSSClasses = {
  EVENT_EDIT: '.event--edit',
  ROLLUP_BTN: '.event__rollup-btn',
  DELETE_BTN: '.event__reset-btn',
  POINT_TYPE: '.event__type-list',
  DESTINATION: '.event__field-group--destination',
  OFFERS: '.event__section--offers',
  BASE_PRICE: '.event__field-group--price',
};

function createEventTypeTemplate(currentPointType) {
  return POINT_TYPES.map((pointType) => {
    const checkedState = pointType === currentPointType ? 'checked' : '';
    const loweredPointTypeName = pointType.toLowerCase();

    return /*html*/`
      <div class="event__type-item">
        <input id="event-type-${loweredPointTypeName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${loweredPointTypeName}" ${checkedState}>
        <label class="event__type-label  event__type-label--${loweredPointTypeName}" for="event-type-${loweredPointTypeName}-1">${pointType}</label>
      </div>
    `;
  }).join('');
}

function createOffersTemplate(offers, typedOffersList) {
  return typedOffersList.map(({id, title, price}) => {
    const loweredOfferTitle = title.toLowerCase().split(' ').join('-');
    const checkedState = offers?.has(id) ? 'checked' : '';

    return /*html*/`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${loweredOfferTitle}-1" type="checkbox" name="event-offer-${loweredOfferTitle}" data-id="${id}" ${checkedState}>
        <label class="event__offer-label" for="event-offer-${loweredOfferTitle}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  }).join('');
}

function createDestinationsTemplate(destinations) {
  return destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
}

function createPhotosTemplate(photos) {
  const photosArr = photos.slice();

  return /*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosArr.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`)}
      </div>
    </div>`;
}

function createEditPointTemplate({
  type,
  cost,
  offers,
  destination,
  dateFrom,
  dateTo,
  destinationsList,
  typedOffersList,
  isTypeHasOffers,
  isHasDestination,
  isNewPoint,
  isOptionsLoaded,
  isSaving,
  isDeleting,
  isDisabled,
}) {
  const eventTypeTemplate = createEventTypeTemplate(type);
  const offersTemplate = isTypeHasOffers ? createOffersTemplate(offers, typedOffersList) : '';
  const destinationsTemplate = createDestinationsTemplate(destinationsList);
  const photosTemplate = destination?.pictures ? createPhotosTemplate(destination.pictures) : '';
  const disabledState = (!isOptionsLoaded || isDisabled) ? 'disabled' : '';
  const saveBtnText = (isSaving) ? BtnText.SAVING : BtnText.SAVE;
  const abortBtnDefaultText = (isNewPoint) ? BtnText.CANCEL : BtnText.DELETE;
  const abortBtnText = (isDeleting) ? BtnText.DELETING : abortBtnDefaultText;

  return /*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabledState}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${eventTypeTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destination ? destination.name : ''}"
              list="destination-list-1"
              ${disabledState}
              placeholder="${PlaceholderText.DESTINATION}"
            >
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${disabledState} placeholder="${PlaceholderText.DATE_FROM}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${disabledState} placeholder="${PlaceholderText.DATE_TO}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}" ${disabledState} placeholder="${PlaceholderText.PRICE}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledState}>${saveBtnText}</button>
          <button class="event__reset-btn" type="reset" ${(!isNewPoint) ? disabledState : ''}>${abortBtnText}</button>
          ${!isNewPoint ? /*html*/`
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          ` : ''}
        </header>
        <section class="event__details">
          ${!isOptionsLoaded ? /*html*/`
            <section class="event__section  event__section--loading-failed">
              <h3 class="event__section-title  event__section-title--loading-failed">Loading failed</h3>
              <p class="event__destination-description"> ${OPTIONS_LOADING_FAILED_MESSAGE}</div>
            </section>
          ` : `
            ${offersTemplate ? `
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${offersTemplate}
                </div>
              </section>
            ` : ''}

            ${(isHasDestination && destination.description) ? `
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${destination.description}</p>

                <!-- Вывод фотографий точки маршрута -->
                ${photosTemplate}
              </section>
            ` : ''}
          `}
        </section>
      </form>
    </li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #isNewPoint = null;
  #isOptionsLoaded = null;
  #destinationsList = null;
  #typedOffersList = null;
  #datepickrFrom = null;
  #datepickrTo = null;

  #onTypeChangeCallback = null;
  #onDestinationChangeCallback = null;
  #onSubmitCallback = null;
  #onCancelEditCallback = null;
  #onDeletePointCallback = null;

  /**
   * Создание/Редкатирование точки маршрута
   * @param {Object} templateData Объект данных для формирования шаблона
   */
  constructor({
    point,
    isNewPoint,
    isOptionsLoaded,
    isSaving,
    isDeleting,
    isDisabled,
    destinationsList,
    typedOffersList,

    onTypeChangeCallback,
    onDestinationChangeCallback,
    onSubmitCallback,
    onCancelEditCallback,
    onDeletePointCallback
  }) {
    super();

    const convertedData = EditPointView.convertDataToState({
      ...point,
      isNewPoint,
      isOptionsLoaded,
      isDisabled,
      isSaving,
      isDeleting,
      destinationsList,
      typedOffersList
    });

    this._setState(convertedData);
    this.#point = point;
    this.#isNewPoint = isNewPoint;
    this.#isOptionsLoaded = isOptionsLoaded;
    this.#destinationsList = destinationsList;
    this.#typedOffersList = typedOffersList;

    this.#onTypeChangeCallback = onTypeChangeCallback;
    this.#onDestinationChangeCallback = onDestinationChangeCallback;
    this.#onSubmitCallback = onSubmitCallback;
    this.#onCancelEditCallback = onCancelEditCallback;
    this.#onDeletePointCallback = onDeletePointCallback;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers() {
    this.#initDatepickr();

    const pointAbortHandler = this.#isNewPoint ? this.#pointCancelAddHandler : this.#pointDeleteHanler;

    if(!this.#isNewPoint) {
      this.element
        .querySelector(CSSClasses.ROLLUP_BTN)
        .addEventListener('click', this.#pointCancelEditHandler);
    }

    if(!this.#isOptionsLoaded) {
      return;
    }
    this.element
      .querySelector(CSSClasses.EVENT_EDIT)
      .addEventListener('submit', this.#pointSubmitHandler);
    this.element
      .querySelector(CSSClasses.POINT_TYPE)
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element
      .querySelector(CSSClasses.DESTINATION)
      .addEventListener('change', this.#pointDestinationChangeHandler);
    this.element
      .querySelector(CSSClasses.BASE_PRICE)
      .addEventListener('change', this.#pointPriceChangeHandler);
    this.element
      .querySelector(CSSClasses.BASE_PRICE)
      .addEventListener('input', this.#pointPriceInputHandler);
    this.element
      .querySelector(CSSClasses.DELETE_BTN)
      .addEventListener('click', pointAbortHandler);

    if(this._state.isTypeHasOffers) {
      this.element
        .querySelector(CSSClasses.OFFERS)
        .addEventListener('change', this.#pointOffersChangeHandler);
    }
  }

  removeElement() {
    super.removeElement();

    this. #resetDatepickrFrom();
    this. #resetDatepickrTo();
  }

  #updateStateView(data, callback) {
    if(data && Object.keys(data).length > 0) {
      this._setState({ ...data });
    }

    const updatedPoint = EditPointView.convertStateToData({
      id: this.#point.id,
      ...this._state
    });

    callback?.(updatedPoint);
  }

  #initDatepickr() {
    this.#reInitDatepickrFrom();
    this.#reInitDatepickrTo();
  }

  #reInitDatepickrFrom() {
    this.#resetDatepickrFrom();
    const dateStartElem = this.element.querySelector(CSSIDs.DATE_TIME_START);

    this.#datepickrFrom = flatpickr(dateStartElem, {
      ...FLATPIKR_SETTINGS,
      onChange: this.#dateFromChangeHandler
    });
  }

  #reInitDatepickrTo(initialDate) {
    this.#resetDatepickrTo();
    const dateEndElem = this.element.querySelector(CSSIDs.DATE_TIME_END);

    const parsedDateTo = dayjs(this._state.dateTo, DateFormats.CHOSED_DATE);
    const parsetInitialDate = dayjs(initialDate, DateFormats.CHOSED_DATE);
    const isSameOrAfter = parsetInitialDate.isSameOrAfter(parsedDateTo);

    const defaultDateFrom = (isSameOrAfter) ? this._state.dateFrom : this._state.dateTo;

    this.#datepickrTo = flatpickr(dateEndElem, {
      ...FLATPIKR_SETTINGS,
      defaultDate: defaultDateFrom,
      minDate: defaultDateFrom,
      onChange: this.#dateToChangeHandler
    });
  }

  #resetDatepickrFrom() {
    this.#datepickrFrom?.destroy();
    this.#datepickrFrom = null;
  }

  #resetDatepickrTo() {
    this.#datepickrTo?.destroy();
    this.#datepickrTo = null;
  }

  /** Обработчики */
  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const target = evt.target;

    if(target.id === CSSIDs.DEFAULT_POINT_TYPE.slice(1)) {
      return;
    }

    const chosePointType = evt.target.value;

    this. #updateStateView(
      { type: chosePointType, offers: new Set() },
      this.#onTypeChangeCallback
    );
  };

  #dateFromChangeHandler = (_, dateStr) => {
    this._setState({ dateFrom: dateStr });
    this.#reInitDatepickrTo(this._state.dateFrom);
  };

  #dateToChangeHandler = (_, dateStr) => this._setState({ dateTo: dateStr });

  #pointDestinationChangeHandler = (evt) => {
    const target = evt.target;
    const newDestination = this._state.destinationsList
      .find((destination) => destination.name === target.value);

    if(!target.value || !newDestination) {
      target.value = this._state.destination.name || '';
      return;
    }

    this.#updateStateView(
      { destination: newDestination },
      this.#onDestinationChangeCallback
    );
  };

  #pointOffersChangeHandler = (evt) => {
    const target = evt.target;
    const offers = structuredClone(this._state.offers); // т.к. офферы - объекты и изменяются по ссылке, копируем их, чтобы напрямую не менять стейт в обход метода _setState

    if(!target.checked && offers.has(target.dataset.id)) {
      offers.delete(target.dataset.id);
    } else {
      offers.add(target.dataset.id);
    }

    this._setState({ offers: offers });
  };

  #pointPriceChangeHandler = (evt) => {
    const target = evt.target;
    const normillizedPrice = removeChars(target.value);
    const newPrice = (!normillizedPrice || normillizedPrice <= 0) ? 1 : Number(target.value);

    this.updateElement({ cost: newPrice });
  };

  #pointPriceInputHandler = (evt) => {
    const target = evt.target;
    target.value = removeChars(target.value);
  };

  #pointSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#updateStateView({}, this.#onSubmitCallback);
  };

  #pointCancelEditHandler = (evt) => {
    evt.preventDefault();

    const destinationsList = this.#destinationsList;
    const typedOffersList = this.#typedOffersList;

    this.updateElement({
      ...this.#point,
      isNewPoint: this.#isNewPoint,
      destinationsList,
      typedOffersList
    });
    this.#onCancelEditCallback?.();
  };

  #pointDeleteHanler = () => {
    this.#onDeletePointCallback?.(this.#point);
  };

  #pointCancelAddHandler = () => this.#onCancelEditCallback?.(this.#point);

  // TODO: Попробовать отрефакторить эти методы более презентабельно
  static convertDataToState({
    type,
    cost,
    destination,
    destinationsList,
    offers,
    typedOffersList,
    dates,
    isFavorite,
    isNewPoint,
    isOptionsLoaded,
    isSaving,
    isDeleting,
    isDisabled,
  }) {

    const dateFrom = dates?.start ? dayjs(dates.start, DateFormats.CHOSED_DATE).format(DateFormats.CHOSED_DATE) : '';
    const dateTo = dates?.end ? dayjs(dates.end, DateFormats.CHOSED_DATE).format(DateFormats.CHOSED_DATE) : '';

    return {
      type,
      cost,
      offers,
      dateFrom,
      dateTo,
      typedOffersList,
      destinationsList,
      destination: findObjectByID(destination, destinationsList) || '',
      isHasDestination: Boolean(destination),
      isTypeHasOffers: typedOffersList.length > 0,
      isFavorite,
      isNewPoint,
      isOptionsLoaded,
      isSaving,
      isDeleting,
      isDisabled,
    };
  }

  static convertStateToData({
    id,
    type,
    cost,
    destination,
    offers,
    dateFrom,
    dateTo,
    isFavorite
  }) {

    return {
      id,
      type,
      cost,
      destination: destination?.id || '',
      offers,
      dates: {
        start: dateFrom,
        end: dateTo
      },
      isFavorite
    };
  }
}
