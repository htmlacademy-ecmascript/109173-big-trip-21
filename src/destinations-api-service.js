import ApiService from './framework/api-service.js';
import { API_URL, AUTH_TOKEN, END_POINT } from './utils/const.js';


export default class DestinationsApiService extends ApiService {
  constructor(endPoint = END_POINT, authorization = AUTH_TOKEN) {
    super(endPoint, authorization);
  }

  get destinations() {
    return this._load({ url: API_URL.DESTINATIONS })
      .then(ApiService.parseResponse);
  }
}