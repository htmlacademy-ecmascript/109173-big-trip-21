import { getRandomPoint } from '../mock/way-point.js';

const POINTS_COUNT = 4;

export default class PointsModel {
  points = Array.from({length: POINTS_COUNT}, getRandomPoint);

  getPoints() {
    return this.points;
  }
}
