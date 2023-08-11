import ComponentInterface from './ComponentInterface';
import dayjs from 'dayjs';
import { getFormattedDateDiff, DATE_FORMATS } from '../utils.js';

function createOffersTemplate(offers) {
  if (!offers) {
    return;
  }

  return offers.map((offer) =>
  // Выводим только те свойства, которые были выбраны для конкретной точки маршрута
    offer.checked ? /*html*/`
      <li class="event__offer">
        <span class="event__offer-title">${offer.name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.cost}</span>
      </li>` : ''
  ).join(''); // т.к. на выходе map мы получаем массив, а нам нужна строка - делаем строку
}

function createTripEventsListTemplate({type, destination, dates, offers, cost, isFavorite}) {
  const offersTemplate = createOffersTemplate(offers);
  const dateForPoint = dayjs(dates.start).format(DATE_FORMATS.FOR_POINT);
  const dateStart = dayjs(dates.start).format(DATE_FORMATS.FOR_POINT_PERIODS);
  const dateEnd = dayjs(dates.end).format(DATE_FORMATS.FOR_POINT_PERIODS);

  return /*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(dates.start)}">${dateForPoint}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination ? destination.name : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${dateStart}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${dateEnd}</time>
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

export default class TripEventsListItem extends ComponentInterface {
  constructor(templateData) {
    super(createTripEventsListTemplate(templateData));
  }
}