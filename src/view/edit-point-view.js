import ComponentInterface from './ComponentInterface';
import { getBlankPoint } from '../mock/way-point.js';
import { getDestinations } from '../mock/way-point.js';
import { DateFormats } from '../utils.js';
import dayjs from 'dayjs';

function createEventTypeTemplate() {
  return /*html*/`
    <div class="event__type-item">
      <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
      <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
      <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
      <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
      <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
      <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
      <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
      <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
      <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
    </div>

    <div class="event__type-item">
      <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
      <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
    </div>`;
}

function createOffersTemplate(offers) {
  if (!offers) {
    return;
  }

  return offers.map((offer) => {
    const offerName = offer.name;
    const loweredOfferName = offerName.toLowerCase();
    const offerChecked = offer.checked ? 'checked' : '';

    return /*html*/`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${loweredOfferName}-1" type="checkbox" name="event-offer-${loweredOfferName}" ${offerChecked}>
        <label class="event__offer-label" for="event-offer-${loweredOfferName}-1">
          <span class="event__offer-title">${offerName}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.cost}</span>
        </label>
      </div>`;
  }).join('');
}

function createDestinationsTemplate(destinations) {
  return destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
}

function createPhotostemplate(photos) {
  const photosArr = photos.slice();

  return /*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosArr.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.alt}">`)}
      </div>
    </div>`;
}

function createEditPointTemplate({type, destination, dates, offers, cost}) {
  const eventTypeTemplate = createEventTypeTemplate();
  const offersTemplate = createOffersTemplate(offers);
  const destinationsTemplate = createDestinationsTemplate(getDestinations());
  const photosTemplate = destination.photos ? createPhotostemplate(destination.photos) : '';
  const dateStart = dates.start ? dayjs(dates.start).format(DateFormats.CHOSED_DATE) : '';
  const dateEnd = dates.end ? dayjs(dates.end).format(DateFormats.CHOSED_DATE) : '';

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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}"> <!-- 18/03/19 12:25-->
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}"> <!-- 18/03/19 13:35 -->
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

export default class EditPointView extends ComponentInterface {
  constructor(templateData = getBlankPoint()) { // Если в конструктор не переданы данные - создается новая пустая точка
    super(createEditPointTemplate(templateData));
  }
}
