import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { pointTypes, getBlankPoint , getDestinations, getOffers} from '../mock/way-point.js';
import { DateFormats, findObjectByID, upperCaseFirst } from '../utils/utils.js';

const offersList = getOffers();
const destinationsList = getDestinations();
const CSSIDs = {DEFAULT_POINT_TYPE: '#event-type-toggle-1'};
const CSSClasses = {EVENT_EDIT: '.event--edit', ROLLUP_BTN: '.event__rollup-btn', POINT_TYPE: '.event__header'};

function createEventTypeTemplate(currentPointType) {
  return pointTypes.map((pointType) => {
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

function createOffersTemplate(offerIDs) {
  if (!offerIDs) {
    return;
  }

  return offerIDs.map((offerID) => {
    const {name, cost, checked} = findObjectByID(offerID, offersList);
    const loweredOfferName = name.toLowerCase();
    const offerChecked = checked ? 'checked' : '';

    return /*html*/`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${loweredOfferName}-1" type="checkbox" name="event-offer-${loweredOfferName}" ${offerChecked}>
        <label class="event__offer-label" for="event-offer-${loweredOfferName}-1">
          <span class="event__offer-title">${name}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${cost}</span>
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

function createEditPointTemplate({type, destination, dates, offers, cost}) {
  const eventTypeTemplate = createEventTypeTemplate(type);
  const offersTemplate = createOffersTemplate(offers);
  const currentDestination = findObjectByID(destination, destinationsList);
  const destinationsTemplate = createDestinationsTemplate(destinationsList);
  const photosTemplate = currentDestination.pictures ? createPhotosTemplate(currentDestination.pictures) : '';
  const dateStart = dates.start.format(DateFormats.CHOSED_DATE);
  const dateEnd = dates.end.format(DateFormats.CHOSED_DATE);

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
export default class EditPointView extends AbstractStatefulView {
  #templateData = null;
  #onSubmitCallback = null;
  #onFinishEditCallback = null;
  #onTypeChangeCallback = null;

  /**
   * Создание/Редкатирование точки маршрута
   * @param {Object} templateData Объект данных для формирования шаблона
   */
  constructor({point = getBlankPoint(), onSubmitCallback, onFinishEditCallback, onTypeChangeCallback}) {
    super();

    this.#templateData = point;
    this.#onSubmitCallback = onSubmitCallback;
    this.#onFinishEditCallback = onFinishEditCallback;
    this.#onTypeChangeCallback = onTypeChangeCallback;

    this.element.querySelector(CSSClasses.EVENT_EDIT).addEventListener('submit', this.#pointSubmitHandler);
    this.element.querySelector(CSSClasses.ROLLUP_BTN).addEventListener('click', this.#pointFinishEditHandler);
    this.element.querySelector(CSSClasses.POINT_TYPE).addEventListener('change', this.#pointTypeChangeHandler);
  }

  get template() {
    return createEditPointTemplate(this.#templateData);
  }

  _restoreHandlers() {
    return true;
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
}
