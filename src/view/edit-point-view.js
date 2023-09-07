import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, BLANK_POINT } from '../mock/way-point.js';
import { DateFormats, upperCaseFirst, findObjectByID, updateItem, getIDs } from '../utils/utils.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const FLATPIKR_SETTINGS = {
  enableTime: true,
  dateFormat: DateFormats.FLATPICKR,
  minuteIncrement: 1,
  'time_24hr': true,
  // 'locale': Russian
};

const CSSIDs = {
  DEFAULT_POINT_TYPE: '#event-type-toggle-1',
  DATE_TIME_START: '#event-start-time-1',
  DATE_TIME_END: '#event-end-time-1',
};

const CSSClasses = {
  EVENT_EDIT: '.event--edit',
  ROLLUP_BTN: '.event__rollup-btn',
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

function createOffersTemplate(offers) {
  return offers.map(({id, title, price, checked}) => {
    const loweredOfferTitle = title.toLowerCase().split(' ').join('-');
    const offerChecked = checked ? 'checked' : '';

    return /*html*/`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${loweredOfferTitle}-1" type="checkbox" name="event-offer-${loweredOfferTitle}" data-id="${id}" ${offerChecked}>
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
  destinations,
  offers,
  isHasOffers,
  isHasDestination}) {

  const eventTypeTemplate = createEventTypeTemplate(type);
  const offersTemplate = isHasOffers ? createOffersTemplate(offers) : '';
  const destinationsTemplate = createDestinationsTemplate(destinations);
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
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
          ${isHasDestination ? `
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
  #point = null;
  #datepickrFrom = null;
  #datepickrTo = null;

  #onSubmitCallback = null;
  #onFinishEditCallback = null;
  #onTypeChangeCallback = null;
  #onDatesChangeCallback = null;
  #onDestinationChangeCallback = null;
  // #onPriceChangeCallback = null;

  /**
   * Создание/Редкатирование точки маршрута
   * @param {Object} templateData Объект данных для формирования шаблона
   */
  constructor({
    point = BLANK_POINT,
    destinations,
    offers,
    onSubmitCallback,
    onFinishEditCallback,
    onTypeChangeCallback,
    onDestinationChangeHandler,
    onDatesChangeCallback}) {

    super();

      console.log('Полученная точка: ', point, offers);

    this._setState(EditPointView.convertDataToState({...point, destinations, offers})); // <- Проблема с офферами тут. offers перезаписывает point.offers !!!!
    this.#point = point;
    this.#onSubmitCallback = onSubmitCallback;
    this.#onFinishEditCallback = onFinishEditCallback;
    this.#onTypeChangeCallback = onTypeChangeCallback;
    this.#onDatesChangeCallback = onDatesChangeCallback;
    this.#onDestinationChangeCallback = onDestinationChangeHandler;
    // this.#onPriceChangeHandler = onPriceChangeHandler;

    this.#initDatepickr();
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers() {
    this.element
      .querySelector(CSSClasses.EVENT_EDIT)
      .addEventListener('submit', this.#pointSubmitHandler);
    this.element
      .querySelector(CSSClasses.ROLLUP_BTN)
      .addEventListener('click', this.#pointFinishEditHandler);
    this.element
      .querySelector(CSSClasses.POINT_TYPE)
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element
      .querySelector(CSSClasses.DESTINATION)
      .addEventListener('change', this.#pointDestinationChangeHandler);
    this.element
      .querySelector(CSSClasses.BASE_PRICE)
      .addEventListener('change', this.#pointPriceChangeCallback);

    if(this._state.isHasOffers) {
      this.element
        .querySelector(CSSClasses.OFFERS)
        .addEventListener('change', this.#pointOffersChangeHandler);
    }
  }

  removeElement() {
    super.removeElement();

    this.#datepickrFrom?.destroy();
    this.#datepickrTo?.destroy();

    this.#datepickrFrom = null;
    this.#datepickrTo = null;
  }

  #initDatepickr() {
    const defaultDateFrom = this._state.dateFrom;
    const defaultDateTo = this._state.dateTo;
    const dateStartElem = this.element.querySelector(CSSIDs.DATE_TIME_START);
    const dateEndElem = this.element.querySelector(CSSIDs.DATE_TIME_END);

    this.#datepickrFrom = flatpickr(dateStartElem, {
      ...FLATPIKR_SETTINGS,
      defaultDate: defaultDateFrom,
      onChange: this.#dateFromChangeHandler
    });

    this.#datepickrTo = flatpickr(dateEndElem, {
      ...FLATPIKR_SETTINGS,
      defaultDate: defaultDateTo,
      minDate: defaultDateFrom,
      onChange: this.#dateToChangeHandler
    });
  }

  // TODO: Пока пользователь не отправил форму - нам всего лишь нужно перерисовывать форму
  // без изменения данных на сервере, для этого можно завести метот updateView, чтобы, в случае
  // отмены пользоваетелем редактирования, можно было вернуть все, как было
  #pointSubmitHandler = (evt) => {
    evt.preventDefault();

    const updatedPoint = EditPointView.convertStateToData(this._state);

    this.#onSubmitCallback?.(updatedPoint);
  };

  #pointFinishEditHandler = (evt) => {
    evt.preventDefault();

    this._setState(this.#point);

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

  #dateFromChangeHandler = (_, dateStr) => {
    this._setState({dateFrom: dateStr});
  };

  #dateToChangeHandler = (_, dateStr) => {
    this._setState({dateTo: dateStr});
  };

  // TODO: При изменении пункта назначения, пропадает обработчик на ESC - поправить
  #pointDestinationChangeHandler = (evt) => {
    const target = evt.target;
    const newDestination = this._state.destinations.find((destination) => destination.name === target.value);

    if(!target.value || !newDestination) {
      target.value = this._state.destination.name;
      return;
    }


    this._setState({destination: newDestination.id});
    this.#onDestinationChangeCallback?.(newDestination.id);
  };

  #pointOffersChangeHandler = (evt) => {
    const target = evt.target;
    const offers = structuredClone(this._state.offers); // т.к. офферы - объекты и изменяются по ссылке, копируем их, чтобы напрямую не менять стейт в обход метода _setState
    const updatedOffer = offers.find((offer) => offer.id === target.dataset.id);
    updatedOffer.checked = target.checked;

    const updatedOffers = updateItem(offers, updatedOffer);


    this._setState({offers: updatedOffers});
    console.log('Офферы в стейте: ', this._state.offers);
  };

  #pointPriceChangeCallback = (evt) => {
    const target = evt.target;
    const newPrice = !target.value ? 0 : target.value;

    this._setState({cost: newPrice});
  };

  static convertDataToState(data) {
    console.log('Офферы при конвертации: ', data.offers); // <- почему-то приходят старые, необновленные офферы
    const dateFrom = data.dates.start.format(DateFormats.CHOSED_DATE);
    const dateTo = data.dates.end.format(DateFormats.CHOSED_DATE);

    return {
      type: data.type,
      cost: data.cost,
      destination: findObjectByID(data.destination, data.destinations),
      dateFrom: dateFrom,
      dateTo: dateTo,
      offers: data.offers,
      destinations: data.destinations,
      isHasDestination: Boolean(data.destination),
      isHasOffers: data.offers.length > 0
    };
  }

  static convertStateToData({
    type,
    cost,
    destination,
    offers,
    dateFrom,
    dateTo}) {

    const checkedOffers = offers.filter((offer) => offer.checked);
    const checkedOffersIDs = getIDs(checkedOffers);

    return {
      type,
      cost,
      destination: destination.id || '',
      offers: checkedOffersIDs,
      dates: {
        start: dayjs(dateFrom, DateFormats.CHOSED_DATE),
        end: dayjs(dateTo, DateFormats.CHOSED_DATE)
      }
    };
  }
}
