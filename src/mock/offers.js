import {
  getRandomInt,
  getRandomBoolean,
  getUniqRandomArrayElements,
} from '../utils/utils.js';

const OFFER_NAMES = ['Transfer', 'Meet in Airport', 'Extra Luggage', 'Lunch', 'Switch to comfort'];
const OfferPrice = {MIN: 50, MAX: 500};
const offerIDs = [];
const offers = createOffers();

function createOffers() {
  return OFFER_NAMES.slice().map((offerName) => {
    const offerID = crypto.randomUUID();
    offerIDs.push(offerID);

    return {
      id: offerID,
      title: offerName,
      price: getRandomInt(OfferPrice.MIN, OfferPrice.MAX),
      checked: getRandomBoolean(),
    };
  });
}

function createOffersWithType(pointTypes) {
  const offersWithType = [];

  pointTypes.forEach((pointType) => {
    offersWithType.push({
      type: pointType,
      offers: getRandomOffers(offers) || []
    });
  });

  return offersWithType;
}

function getRandomOffers(offersList) {
  return getUniqRandomArrayElements(offersList);
}

function getOfferIDs() {
  return offerIDs;
}

export {
  createOffers,
  createOffersWithType,
  getRandomOffers,
  getOfferIDs
};
