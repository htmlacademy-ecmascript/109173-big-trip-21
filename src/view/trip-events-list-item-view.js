import AbstractView from '../framework/view/abstract-view.js';
import { getFormattedDateDiff, DateFormats, findObjectByID } from '../utils/utils.js';

const CSSClasses = {ROLLUP_BTN: '.event__rollup-btn', FAVORITE_BTN: '.event__favorite-btn'};

function createOffersTemplate(offers) {
  if (!offers) {
    return;
  }

  return offers.map(({title, price, checked}) => {
    if (checked) {
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

function createTripEventsListTemplate({type, destination, dates, offers, cost, isFavorite, destinationsList}) {
  const destinationInfo = findObjectByID(destination, destinationsList);
  const offersTemplate = createOffersTemplate(offers);
  const dateForPoint = dates.start.format(DateFormats.FOR_POINT);
  const dateStart = dates.start.format(DateFormats.FOR_POINT_PERIODS);
  const dateEnd = dates.end.format(DateFormats.FOR_POINT_PERIODS);
  const dateTimeStart = dates.start.format(DateFormats.DATE_TIME);
  const dateTimeEnd = dates.end.format(DateFormats.DATE_TIME);

  return /*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dates.start}">${dateForPoint}</time>
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
          <p class="event__duration">${getFormattedDateDiff(dates.start, dates.end)}</p>
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
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
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
  #templateData = null;
  #pointEditBtn = null;
  #onEditCallback = null;
  #onFavoriteCallback = null;

  constructor({point, destinationsList, onEditCallback, onFavoriteCallback}) {
    super();

    this.#templateData = {...point, destinationsList};
    this.#onEditCallback = onEditCallback;
    this.#onFavoriteCallback = onFavoriteCallback;

    this.element.querySelector(CSSClasses.ROLLUP_BTN).addEventListener('click', this.#pointEditBtnHandler);
    this.element.querySelector(CSSClasses.FAVORITE_BTN).addEventListener('click', this.#pointFavoriteClickHandler);
  }

  get template() {
    return createTripEventsListTemplate(this.#templateData);
  }

  #pointEditBtnHandler = (evt) => {
    evt.preventDefault();

    this.#onEditCallback?.();
  };

  #pointFavoriteClickHandler = (evt) => {
    evt.preventDefault();

    this.#onFavoriteCallback?.();
  };
}
