import PointsApiService from '../points-api-service.js';
import Adapter from '../adapter.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';
export default class PointsModel extends Observable {
  #points = [];
  #destinationsModel = null;
  #offersModel = null;

  constructor({ destinationsModel, offersModel }) {
    super();

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  async init() {
    try {
      await this.#destinationsModel.init();
      await this.#offersModel.init();

      const pointsApiService = new PointsApiService();
      const points = await pointsApiService.points;
      this.#points = points.map(Adapter.adaptPointToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
    // console.log(this.#points);
    // console.log(this.#destinationsModel.destinations);
    // console.log(this.#offersModel.offers);
  }

  updatePoint(updateType, updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points.push({ ...newPoint, id: crypto.randomUUID() });
    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, { remainingPointsCount: this.#points.length });
  }
}
