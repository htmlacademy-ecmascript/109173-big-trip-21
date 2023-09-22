import {
  getRandomInt,
  getRandomArrayElement,
  getRandomBoolean,
  getMockDate,
  getIDs,
  getUniqRandomArrayElements
} from '../utils/utils.js';

import { POINT_TYPES } from '../utils/const.js';

const PointPrice = {MIN: 500, MAX: 5000};

// TODO - поменять структуру согласно https://21.objects.pages.academy/spec/big-trip#get-/big-trip/points
function createPoint(
  pointType,
  destinationsModel,
  offersModel
) {
  const pointTypeOffers = offersModel.getOffersByPointType(pointType);
  const pointOffers = getUniqRandomArrayElements(pointTypeOffers);
  const pointOffersIDs = new Set(getIDs(pointOffers));

  return {
    id: crypto.randomUUID(),
    type: pointType,
    // destination: getRandomDestination(destinations),
    destination: destinationsModel.getRandomDestination(),
    dates: { // <- Заменить на date_from , date_to
      start: getMockDate(),
      end: getMockDate(true)
    },
    offers: pointOffersIDs,
    cost: getRandomInt(PointPrice.MIN, PointPrice.MAX), // <- заменить на base_price
    isFavorite: getRandomBoolean(),
  };
}

function getRandomPoint({ destinationsModel, offersModel }) {
  const pointType = getRandomArrayElement(POINT_TYPES);

  return createPoint(
    pointType,
    destinationsModel,
    offersModel
  );
}

export { getRandomPoint };
