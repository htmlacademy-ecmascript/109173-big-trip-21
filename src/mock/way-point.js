import {
  getRandomInt,
  getRandomArrayElement,
  getRandomBoolean,
  getMockDate
} from '../utils/utils.js';

import {createDestinations, getRandomDestination } from '../mock/destinations.js';
import { createOffersByType } from '../mock/offers.js';

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
const offersByType = createOffersByType(POINT_TYPES);
const destinations = createDestinations();


// TODO - поменять структуру согласно https://21.objects.pages.academy/spec/big-trip#get-/big-trip/points
function createPoint(pointType) {
  const pointOffers = getPointOffers(pointType);

  return {
    id: crypto.randomUUID(),
    type: pointType,
    // destination: getRandomArrayElement(destinations), // <- Заменить на айдишники пунктов назначения
    destination: getRandomDestination(destinations),
    dates: { // <- Заменить на date_from , date_to
      start: getMockDate(),
      end: getMockDate(true)
    },
    offers: pointOffers,
    cost: getRandomInt(PointPrice.MIN, PointPrice.MAX), // <- заменить на base_price
    isFavorite: getRandomBoolean(),
  };
}

function getBlankPoint() {
  return BLANK_POINT;
}

function getRandomPoint() {
  const pointType = getRandomArrayElement(POINT_TYPES);

  return createPoint(pointType);
}

function getOffers() {
  return offersByType;
}

function getDestinations() {
  return destinations;
}

function getPointOffers(pointType) {
  return offersByType.find((offer) => offer.type === pointType)?.offers || [];
}

export {
  POINT_TYPES,
  getBlankPoint,
  getRandomPoint,
  getOffers,
  getDestinations
};
