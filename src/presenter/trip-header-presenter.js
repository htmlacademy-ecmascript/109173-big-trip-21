import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoPriceView from '../view/trip-info-price-view.js';
import { findObjectByID } from '../utils/utils.js';
import AddNewPointBtnView from '../view/add-new-point-btn-view.js';

export default class TripHeaderPresenter {
  #mainContainer = null;
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #addNewPointBrnComponent = null;
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
    this.#addNewPointBrnComponent = new AddNewPointBtnView({ onAddNewPointCallback: this.#addNewPointBtnClickHandler });
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
    render(this.#addNewPointBrnComponent, this.#mainContainer); // Отрисовываем кнопку добавления новой точки
  }

  #reRenderPrice({ price = 0 } = {}) {
    const newPriceComponent = new TripInfoPriceView({ price });

    replace(newPriceComponent, this.#priceComponent);
    remove(this.#priceComponent);

    this.#priceComponent = newPriceComponent;
  }

  #reRenderTripInfo({ pointsInfo }) {
    const newTripInfoComponent = new TripInfoMainView({ pointsInfo });

    replace(newTripInfoComponent, this.#tripInfoComponent);
    remove(this.#tripInfoComponent);

    this.#tripInfoComponent = newTripInfoComponent;
  }

  #getCurrentPrice() {
    return [...this.#pointsModel.points].reduce((accumulator, point) => accumulator + Number(point.cost), 0);
  }

  #getPointsInfo() {
    return [...this.#pointsModel.points].map(({ destination, dates }) => {
      const destinationInfo = findObjectByID(destination, this.#destinations)?.name;
      return {
        destination: destinationInfo, // <- перевести id пунктов назначения в названия
        dateFrom: dates.start,
        dateTo: dates.end
      };
    });
  }

  /**
   * Обрнаботчики
   */
  #addNewPointBtnClickHandler = () => {
    console.log('Добавляем новую точку');
  };

  #modelChangeHandler = () => {
    this.#reRenderPrice({ price: this.#getCurrentPrice() });
    this.#reRenderTripInfo({ pointsInfo: this.#getPointsInfo() });
  };
}
