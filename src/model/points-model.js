import { getRandomPoint } from '../mock/way-point.js';
import { POINTS_COUNT } from '../utils/const.js';
export default class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  updatePoint(updatedPoint) {
    return this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
  }
}
