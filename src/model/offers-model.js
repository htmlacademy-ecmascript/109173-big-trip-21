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
      this.#offers = [];
      throw new Error(err);
    }
  }

  getByPointType(type) {
    let typedOffers = null;

    if(this.#offers.length) {
      typedOffers = this.#offers.find((offer) => offer.type === type);
    }

    return typedOffers?.offers || [];
  }
}
