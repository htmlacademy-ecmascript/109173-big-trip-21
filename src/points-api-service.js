import Adapter from './adapter.js';
import ApiService from './framework/api-service.js';
import { API_URL, AUTH_TOKEN, END_POINT, Method } from './utils/const.js';


export default class PointsApiService extends ApiService {
  constructor(endPoint = END_POINT, authorization = AUTH_TOKEN) {
    super(endPoint, authorization);
  }

  get points() {
    return this._load({ url: API_URL.POINTS })
      .then(ApiService.parseResponse);
  }

  async updatePoint(updatedPoint) {
    const adaptedPoint = Adapter.adaptPointToServer(updatedPoint);
    const response = await this._load({
      url: `${API_URL.POINTS}/${updatedPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptedPoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
