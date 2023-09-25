import PointsApiService from '../points-api-service.js';
import Adapter from '../adapter.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

const ERROR = {
  UPDATE: 'Can`t update point'
};
export default class PointsModel extends Observable {
  #points = [];
  #destinationsModel = null;
  #offersModel = null;
  #pointsApiService = null;

  constructor({ destinationsModel, offersModel }) {
    super();

    this.#pointsApiService = new PointsApiService();
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

      const points = await this.#pointsApiService.points;
      this.#points = points.map(Adapter.adaptPointToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = Adapter.adaptPointToClient(response);

      this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error(ERROR.UPDATE);
    }
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
