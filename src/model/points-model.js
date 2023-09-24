import PointsApiService from '../points-api-service.js';
import Adapter from '../adapter.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

const ErrorText = {
  ADD: 'Can`t add new point',
  UPDATE: 'Can`t update this point',
  DELETE: 'Can`t delete this point',
  UNEXIST: 'Can`t delete unexisting point',
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
      this.#points = points.map(Adapter.pointToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = Adapter.pointToClient(response);

      this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error(ErrorText.UPDATE);
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const addedPoint = Adapter.pointToClient(response);

      this.#points.push({ ...addedPoint});
      this._notify(updateType, addedPoint);
    } catch(err) {
      throw new Error(ErrorText.ADD);
    }
  }

  async deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    if(index === -1) {
      throw new Error(ErrorText.UNEXIST);
    }

    try {
      await this.#pointsApiService.deletePoint(deletedPoint);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, { remainingPointsCount: this.#points.length });
    } catch(err) {
      throw new Error(ErrorText.DELETE);
    }
  }
}
