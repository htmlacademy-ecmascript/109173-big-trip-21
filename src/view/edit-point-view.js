import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, BLANK_POINT } from '../mock/way-point.js';
import { DateFormats, upperCaseFirst, findObjectByID } from '../utils/utils.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
// import { Russian } from "flatpickr/dist/l10n/ru.js"

const CSSIDs = {
  DATE_TIME_START: '#event-start-time-1',
  DATE_TIME_END: '#event-end-time-1',
  DEFAULT_POINT_TYPE: '#event-type-toggle-1'
};
const CSSClasses = {
  EVENT_EDIT: '.event--edit',
  ROLLUP_BTN: '.event__rollup-btn',
  POINT_TYPE: '.event__type-list'
};

const FLATPIKR_SETTINGS = {
  enableTime: true,
  altFormat: DateFormats.FLATPICKR,
  altInput: true,
  'time_24hr': true,
  // 'locale': Russian
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

function createOffersTemplate(offers) {
  if (!offers) {
    return;
  }

  return offers.map(({title, price, checked}) => {
    const loweredOfferTitle = title.toLowerCase();
    const offerChecked = checked ? 'checked' : '';

    return /*html*/`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${loweredOfferTitle}-1" type="checkbox" name="event-offer-${loweredOfferTitle}" ${offerChecked}>
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
  destination,
  dateFrom,
  dateTo,
  cost,
  destinationsList,
  offersList}) {
  const eventTypeTemplate = createEventTypeTemplate(type);
  const offersTemplate = createOffersTemplate(offersList);
  const destinationsTemplate = createDestinationsTemplate(destinationsList);
  const photosTemplate = destination.pictures ? createPhotosTemplate(destination.pictures) : '';

  return /*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}"> <!-- 18/03/19 12:25-->
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}"> <!-- 18/03/19 13:35 -->
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <!-- Если у точки есть доп. услуги - выводим их -->
          ${offersTemplate ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${offersTemplate}
              </div>
            </section>` : ''}

          <!-- Есть есть пункт назначения - показываем блок -->
          ${destination ? `
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destination.description}</p>

              <!-- Вывод фотографий точки маршрута -->
              ${photosTemplate}
            </section>` : ''}
        </section>
      </form>
    </li>`;
}
export default class EditPointView extends AbstractStatefulView {
  #onSubmitCallback = null;
  #onFinishEditCallback = null;
  #onTypeChangeCallback = null;
  #onDatesChangeCallback = null;

  #datepickrStart = null;
  #datepickrEnd = null;

  /**
   * Создание/Редкатирование точки маршрута
   * @param {Object} templateData Объект данных для формирования шаблона
   */
  constructor({
    point = BLANK_POINT,
    destinationsList,
    offersList,
    onSubmitCallback,
    onFinishEditCallback,
    onTypeChangeCallback,
    onDatesChangeCallback}) {
    super();

    this._setState(EditPointView.convertDataToState({...point, destinationsList, offersList}));

    this.#onSubmitCallback = onSubmitCallback;
    this.#onFinishEditCallback = onFinishEditCallback;
    this.#onTypeChangeCallback = onTypeChangeCallback;
    this.#onDatesChangeCallback = onDatesChangeCallback;

    this.#initDatepickr();
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector(CSSClasses.EVENT_EDIT).addEventListener('submit', this.#pointSubmitHandler);
    this.element.querySelector(CSSClasses.ROLLUP_BTN).addEventListener('click', this.#pointFinishEditHandler);
    this.element.querySelector(CSSClasses.POINT_TYPE).addEventListener('change', this.#pointTypeChangeHandler);
  }

  static convertDataToState(data) {
    return {
      ...data,
      destination: findObjectByID(data.destination, data.destinationsList),
      dateFrom: data.dates.start.format(DateFormats.CHOSED_DATE),
      dateTo: data.dates.end.format(DateFormats.CHOSED_DATE),
      offersList: data.offersList,
      destinationsList: data.destinationsList,
    };
  }

  static convertStateToData(data) {
    return data; // TODO конвертировать стэйт обратно в данные
  }

  removeElement() {
    super.removeElement();

    this.#datepickrStart?.destroy();
    this.#datepickrEnd?.destroy();

    this.#datepickrStart = null;
    this.#datepickrEnd = null;
  }

  #initDatepickr() {
    // TODO: не работают даты, т.к. не nstanceof dayjs после копирования. Попробовать исправить.
    const defaultDateStart = dayjs(this._state.dateFrom).toString();
    const defaultDateEnd = dayjs(this._state.dateTo).toString();
    const dateStartElem = this.element.querySelector(CSSIDs.DATE_TIME_START);
    const dateEndElem = this.element.querySelector(CSSIDs.DATE_TIME_END);

    this.#datepickrStart = flatpickr(dateStartElem, {
      ...FLATPIKR_SETTINGS,
      defaultDate: defaultDateStart,
      onChange: this.#pointDatesChangeHandler
    });

    this.#datepickrEnd = flatpickr(dateEndElem, {
      ...FLATPIKR_SETTINGS,
      defaultDate: defaultDateEnd,
      minDate: defaultDateStart,
      onChange: this.#pointDatesChangeHandler
    });
  }

  #pointSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#onSubmitCallback?.();
  };

  #pointFinishEditHandler = (evt) => {
    evt.preventDefault();

    this.#onFinishEditCallback?.();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    const target = evt.target;

    if(target.id === CSSIDs.DEFAULT_POINT_TYPE.slice(1)) {
      return;
    }

    const chosedPointType = upperCaseFirst(evt.target.value);

    this.#onTypeChangeCallback?.(chosedPointType);
  };

  #pointDatesChangeHandler = (_, dateStr, instance) => {
    const dates = this._state.dates;
    const target = instance.input;

    switch(target.id) {
      case CSSIDs.DATE_TIME_START.slice(1): {
        dates.start = dayjs(dateStr);
        break;
      }
      case CSSIDs.DATE_TIME_END.slice(1): {
        dates.end = dayjs(dateStr);
        break;
      }
    }

    this.#onDatesChangeCallback?.(dates);
  };
}
