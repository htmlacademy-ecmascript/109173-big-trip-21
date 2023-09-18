import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoPriceView from '../view/trip-info-price-view.js';
import { findObjectByID } from '../utils/utils.js';

export default class TripHeaderPresenter {
  #mainContainer = null;
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #priceComponent = null;
  #destinations = null;

  #destinationsModel = null;
  #pointsModel = null;

  constructor({
    mainContainer,
    destinationsModel,
    pointsModel
  }) {
    this.#mainContainer = mainContainer; // Контейнер для отрисовки общей информации о путешествии
    this.#tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;

    this.#destinations = this.#destinationsModel.destinations;

    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    this.#tripInfoComponent = new TripInfoMainView({ pointsInfo: this.#getPointsInfo() });
    this.#priceComponent = new TripInfoPriceView({ price: this.#getCurrentPrice() });

    render(this.#tripInfoContainer, this.#mainContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(this.#tripInfoComponent, this.#tripInfoContainer.element); // Отрисовываем информацию о маршруте и датах
    render(this.#priceComponent, this.#tripInfoContainer.element); // Отрисовываем информацию о цене
  }

  #reRenderPrice({ price = 0 } = {}) {
    const newPriceComponent = new TripInfoPriceView({ price });

    replace(newPriceComponent, this.#priceComponent);
    remove(this.#priceComponent);

    this.#priceComponent = newPriceComponent;
  }

  #reRenderTripInfo = ({ pointsInfo }) => {
    const newTripInfoComponent = new TripInfoMainView({ pointsInfo });

    replace(newTripInfoComponent, this.#tripInfoComponent);
    remove(this.#tripInfoComponent);

    this.#tripInfoComponent = newTripInfoComponent;
  };

  #getCurrentPrice = () => [...this.#pointsModel.points].reduce((accumulator, point) => accumulator + Number(point.cost), 0);

  #getPointsInfo = () =>
    [...this.#pointsModel.points].map(({ destination, dates }) => {
      const destinationInfo = findObjectByID(destination, this.#destinations)?.name;
      return {
        destination: destinationInfo, // <- перевести id пунктов назначения в названия
        dateFrom: dates.start,
        dateTo: dates.end
      };
    });

  #modelChangeHandler = () => {
    this.#reRenderPrice({ price: this.#getCurrentPrice() });
    this.#reRenderTripInfo({ pointsInfo: this.#getPointsInfo() });
  };
}
