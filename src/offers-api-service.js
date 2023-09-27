import ApiService from './framework/api-service.js';
import { AUTH_TOKEN, END_POINT, ApiUrl } from './utils/const.js';


export default class OffersApiService extends ApiService {
  constructor(endPoint = END_POINT, authorization = AUTH_TOKEN) {
    super(endPoint, authorization);
  }

  get offers() {
    return this._load({ url: ApiUrl.OFFERS })
      .then(ApiService.parseResponse);
  }
}
