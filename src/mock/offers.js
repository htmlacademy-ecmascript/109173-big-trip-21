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

function createOffersByType(pointTypes) {
  const offersByType = [];

  pointTypes.forEach((pointType) => {
    offersByType.push({
      type: pointType,
      offers: getRandomOffers(offers) || []
    });
  });

  return offersByType;
}

function getRandomOffers(offersList) {
  return getUniqRandomArrayElements(offersList);
}

function getOfferIDs() {
  return offerIDs;
}

export {
  createOffers,
  createOffersByType,
  getRandomOffers,
  getOfferIDs
};
