import {
  getRandomInt,
  getRandomArrayElement,
  getUniqRandomArrayElements,
  getRandomBoolean,
  getMockDate,
} from '../utils/utils.js';

const RANDOM_PHOTOS_SERVICE_URL = 'https://loremflickr.com/248/152?random=';
const PointPrice = {MIN: 500, MAX: 5000};
const OfferPrice = {MIN: 50, MAX: 500};
const PhotoCount = {MIN: 0, MAX: 4};
const PhotoAltLength = {MIN: 30, MAX: 100};
const pointTypes = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const cityNames = ['Moskow', 'London', 'Amsterdam', 'New Zealand'];
const offerNames = ['Transfer', 'Meet in Airport', 'Extra Luggage', 'Lunch', 'Switch to comfort'];
/** Пустая точка (для создания новой точки маршрута) */
const blankPoint = {
  type: pointTypes[5],
  destination: '',
  dates: '',
  offers: '',
  cost: 0,
  isFavorite: false,
};

const destinationDescriptions = [
  `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa amet dignissimos quae
  placeat aut ipsum, labore facere cum nulla maxime repudiandae voluptate modi harum hic
  adipisci nobis molestiae impedit dicta eligendi officia corrupti quibusdam, eaque alias.`,

  `Facere dolorum esse, tempora quo non consequatur officiis repellat ratione. Facilis
  incidunt quae odit accusantium commodi perferendis vero voluptates quidem officia qui
  sint, consectetur consequatur soluta error.`,

  `Porro quisquam eligendi assumenda incidunt
  eveniet laboriosam veritatis iusto iure adipisci ut dolores debitis, eum voluptatum.
  Tempore debitis alias iste quia temporibus beatae quasi illo rerum, error aliquid dolorem ab.
  Sequi facilis laudantium temporibus dicta ratione delectus?`,

  `is an island country in the southwestern Pacific Ocean.
  It consists of two main landmasses—the North Island (Te Ika-a-Māui) and
  the South Island (Te Waipounamu)—and over 700 smaller islands. It is the
  sixth-largest island country by area and lies east of Australia across
  the Tasman Sea and south of the islands of New Caledonia, Fiji, and Tonga.
  The country's varied topography and sharp mountain peaks, including the Southern Alps,
  owe much to tectonic uplift and volcanic eruptions. New Zealand's capital
  city is Wellington, and its most populous city is Auckland.`
];

const offers = createOffers();
const destinations = createDestinations();

// TODO - поменять структуру согласно https://21.objects.pages.academy/spec/big-trip#get-/big-trip/points
function createPoint(pointType) {
  return {
    id: crypto.randomUUID(),
    type: pointType,
    // destination: getRandomArrayElement(destinations), // <- Заменить на айдишники пунктов назначения
    destination: getRandomDestination(),
    dates: { // <- Заменить на date_from , date_to
      start: getMockDate(),
      end: getMockDate(true)
    },
    offers:getRandomOffers() || [],
    cost: getRandomInt(PointPrice.MIN, PointPrice.MAX), // <- заменить на base_price
    isFavorite: getRandomBoolean(),
  };
}

function getBlankPoint() {
  return blankPoint;
}

function getRandomPoint() {
  const pointType = getRandomArrayElement(pointTypes);

  return createPoint(pointType);
}

function getDestinations() {
  return destinations;
}

function getRandomDestination() {
  return getRandomArrayElement(getIDs(destinations));
}

function createDestinations() {
  return cityNames.slice().map((city) => ({
    id: crypto.randomUUID(),
    name: city,
    description: getRandomArrayElement(destinationDescriptions),
    pictures: Array.from({length: getRandomInt(PhotoCount.MIN, PhotoCount.MAX)}, getRandomPhoto)
  }));
}

function getRandomPhoto() {
  const randomAlt = getRandomArrayElement(destinationDescriptions);
  return {
    src: `${RANDOM_PHOTOS_SERVICE_URL}${crypto.randomUUID()}`,
    alt: randomAlt.slice(0, getRandomInt(PhotoAltLength.MIN, PhotoAltLength.MAX)),
  };
}

function createOffers() {
  return offerNames.slice().map((offerName) => ({
    id: crypto.randomUUID(),
    name: offerName,
    cost: getRandomInt(OfferPrice.MIN, OfferPrice.MAX),
    checked: getRandomBoolean(),
  }));
}

function getOffers() {
  return offers;
}

function getRandomOffers() {
  return getUniqRandomArrayElements(getIDs(offers));
}

function getIDs(itemsObj) {
  return itemsObj.map((item) => item.id);
}


export {
  pointTypes,
  getBlankPoint,
  getRandomPoint,
  getDestinations,
  getOffers
};
