import OffersApiService from '../offers-api-service.js';
export default class OffersModel {
  #offers = null;

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offersApiService = new OffersApiService();
      const offers = await offersApiService.offers;
      this.#offers = offers;
    } catch(err) {
      this.#offers = new Set();
    }
  }

  getOffersByPointType(type) {
    const typedOffers = this.#offers.find((offer) => offer.type === type);

    return typedOffers?.offers || new Set();
  }
}
