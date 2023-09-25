import AbstractView from '../framework/view/abstract-view.js';
import {
  getFormattedDateDiff,
  findObjectByID,
  normalizeDate,
} from '../utils/utils.js';
import { DatesFormat } from '../utils/const.js';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const CSSClasses = {
  ROLLUP_BTN: '.event__rollup-btn',
  FAVORITE_BTN: '.event__favorite-btn',
  FAVORITE_BTN_ACTIVE: '.event__favorite-btn--active'
};

function createOffersTemplate(offers, offersList) {
  return offersList.map(({id, title, price}) => {
    if (offers.has(id)) {
      return /* html */`
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
      `;
    }

    return '';
  }).join(''); // т.к. на выходе map мы получаем массив, а нам нужна строка - делаем строку
}

function createTripEventsListTemplate({
  type,
  destination,
  offers,
  dates,
  cost,
  isFavorite,
  destinationsList,
  typedOffersList
}) {

  const destinationInfo = findObjectByID(destination, destinationsList);
  const offersTemplate = offers.size > 0 ? createOffersTemplate(offers, typedOffersList) : '';
  const dateFrom = dayjs(dates.start, DatesFormat.CHOSED_DATE);
  const dateTo = dayjs(dates.end, DatesFormat.CHOSED_DATE);
  const favoriteBtnActiveClass = (isFavorite) ? CSSClasses.FAVORITE_BTN_ACTIVE.slice(1) : '';

  const pointDate = normalizeDate(dateFrom, DatesFormat.FOR_POINT);
  const dateStart = normalizeDate(dateFrom, DatesFormat.FOR_POINT_PERIODS);
  const dateEnd = normalizeDate(dateTo, DatesFormat.FOR_POINT_PERIODS);
  const dateTimeStart = normalizeDate(dateFrom, DatesFormat.DATE_TIME);
  const dateTimeEnd = normalizeDate(dateTo, DatesFormat.DATE_TIME);
  const datesDiff = getFormattedDateDiff(dateFrom, dateTo);

  return /*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateTimeStart}">${pointDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationInfo ? destinationInfo.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateTimeStart}">${dateStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTimeEnd}">${dateEnd}</time>
          </p>
          <p class="event__duration">${datesDiff}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>
        <!-- Если у точки есть доп. услуги - выводим их -->
        ${offersTemplate ? /*html*/`
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersTemplate}
          </ul>` : ''}
        <button class="event__favorite-btn ${favoriteBtnActiveClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
}

export default class TripEventsListItemView extends AbstractView {
  #point = null;
  #destinationsList = null;
  #typedOffersList = null;
  #onEditCallback = null;
  #onFavoriteToggleCallback = null;

  constructor({
    point,
    destinationsList,
    typedOffersList,
    onEditCallback,
    onFavoriteToggleCallback
  }) {
    super();
    this.#point = point;
    this.#destinationsList = destinationsList;
    this.#typedOffersList = typedOffersList;
    this.#onEditCallback = onEditCallback;
    this.#onFavoriteToggleCallback = onFavoriteToggleCallback;

    this.element.querySelector(CSSClasses.ROLLUP_BTN)
      .addEventListener('click', this.#pointEditBtnHandler);
    this.element.querySelector(CSSClasses.FAVORITE_BTN)
      .addEventListener('click', this.#pointFavoriteToggleHandler);
  }

  get template() {
    return createTripEventsListTemplate({
      ...this.#point,
      destinationsList: this.#destinationsList,
      typedOffersList: this.#typedOffersList,
    });
  }

  /** Обработчики */
  #pointEditBtnHandler = () => this.#onEditCallback?.();
  #pointFavoriteToggleHandler = (evt) => {
    evt.preventDefault();

    const isFavorite = !this.#point.isFavorite;

    this.#onFavoriteToggleCallback?.(isFavorite);
  };
}
