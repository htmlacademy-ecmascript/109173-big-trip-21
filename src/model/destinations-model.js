import DestinationsApiService from '../destinations-api-service.js';
export default class DestinationsModel {
  #destinations = null;

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinationsApiService = new DestinationsApiService();
      const destinations = await destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }
}
