import Adapter from './adapter.js';
import ApiService from './framework/api-service.js';
import { AUTH_TOKEN, END_POINT, ApiUrl, Method } from './utils/const.js';


export default class PointsApiService extends ApiService {
  constructor(endPoint = END_POINT, authorization = AUTH_TOKEN) {
    super(endPoint, authorization);
  }

  get points() {
    return this._load({ url: ApiUrl.POINTS })
      .then(ApiService.parseResponse);
  }

  async updatePoint(updatedPoint) {
    return await this.#sendResponse({
      point: updatedPoint,
      uri: updatedPoint.id,
      method: Method.PUT
    });
  }

  async addPoint(newPoint) {
    return await this.#sendResponse({
      point: newPoint,
      method: Method.POST
    });
  }

  async deletePoint(deletingPoint) {
    return await this.#sendResponse({
      point: deletingPoint,
      method: Method.DELETE
    });
  }

  async #sendResponse({ point, uri = '', method }) {
    let data = null;

    if(method === Method.DELETE) {
      data = { url: `${ApiUrl.POINTS}/${point.id}`, method };
    } else {
      const sendingPoint = Adapter.pointToServer(point);

      data = {
        url: `${ApiUrl.POINTS}/${uri}`,
        method,
        body: JSON.stringify(sendingPoint),
        headers: new Headers({'Content-type': 'application/json'})
      };
    }

    const responce = await this._load(data);
    const parsedResponse = (method === Method.DELETE)
      ? responce
      : await ApiService.parseResponse(responce);

    return parsedResponse;
  }
}
