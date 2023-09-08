import {
  getRandomInt,
  getRandomArrayElement,
  getRandomBoolean,
  getMockDate,
  getIDs,
  getUniqRandomArrayElements
} from '../utils/utils.js';

import {createDestinations, getRandomDestination } from '../mock/destinations.js';
import { createOffersWithType } from '../mock/offers.js';

/** Пустая точка (для создания новой точки маршрута) */
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const BLANK_POINT = {
  type: POINT_TYPES[5],
  destination: '',
  dates: '',
  offers: '',
  cost: 0,
  isFavorite: false,
};
const PointPrice = {MIN: 500, MAX: 5000};
const offersWithType = createOffersWithType(POINT_TYPES);
const destinations = createDestinations();


// TODO - поменять структуру согласно https://21.objects.pages.academy/spec/big-trip#get-/big-trip/points
function createPoint(pointType) {
  const pointTypeOffers = getOffersByType(pointType);
  const pointOffers = getUniqRandomArrayElements(pointTypeOffers);
  const pointOffersIDs = new Set(getIDs(pointOffers));

  return {
    id: crypto.randomUUID(),
    type: pointType,
    // destination: getRandomArrayElement(destinations), // <- Заменить на айдишники пунктов назначения
    destination: getRandomDestination(destinations),
    dates: { // <- Заменить на date_from , date_to
      start: getMockDate(),
      end: getMockDate(true)
    },
    offers: pointOffersIDs,
    cost: getRandomInt(PointPrice.MIN, PointPrice.MAX), // <- заменить на base_price
    isFavorite: getRandomBoolean(),
  };
}

function getRandomPoint() {
  const pointType = getRandomArrayElement(POINT_TYPES);

  return createPoint(pointType);
}

function getOffers() {
  return offersWithType;
}

function getDestinations() {
  return destinations;
}

function getOffersByType(pointType) {
  return offersWithType.find((offer) => offer.type === pointType)?.offers || [];
}

export {
  POINT_TYPES,
  BLANK_POINT,
  getRandomPoint,
  getOffersByType,
  getOffers,
  getDestinations
};
