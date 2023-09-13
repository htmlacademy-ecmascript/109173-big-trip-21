import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/way-point.js';
import { POINTS_COUNT } from '../utils/const.js';
export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  updatePoint(updateType, updatedPoint) {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);

    this._notify(updateType, updatedPoint);
  }

  createPoint(updateType, newPoint) {
    this.#points.push(newPoint);

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, deletedPoint);
  }
}
