import { POINT_TYPES } from '../utils/const.js';
import { createOffersWithType } from '../mock/offers';

export default class OffersModel {
  #offers = null;

  constructor() {
    this.#offers = createOffersWithType(POINT_TYPES);
  }

  get offers() {
    return this.#offers;
  }

  getOffersByPointType(type) {
    const typedOffers = this.#offers.find((offer) => offer.type === type);

    return typedOffers?.offers || [];
  }
}
