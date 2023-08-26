import {
  getRandomInt,
  getRandomArrayElement,
  getUniqRandomArrayElements,
  getRandomBoolean,
  getMockDate,
} from '../utils/utils.js';

const IMG_FOLDER = 'img/photos';
const Price = {MIN: 500, MAX: 5000};
const pointTypes = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const offerNames = ['Transfer', 'Meet in Airport', 'Extra Luggage', 'Lunch', 'Switch to comfort'];
const OfferPrice = {MIN: 50, MAX: 500};
/** Пустая точка (для создания новой точки маршрута) */
const newBlankPoint = {
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
  adipisci nobis molestiae impedit dicta eligendi officia corrupti quibusdam, eaque alias.
  Facere dolorum esse, tempora quo non consequatur officiis repellat ratione. Facilis
  incidunt quae odit accusantium commodi perferendis vero voluptates quidem officia qui
  sint, consectetur consequatur soluta error. Porro quisquam eligendi assumenda incidunt
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

const destinations = [
  {
    id: crypto.randomUUID(),
    name: 'Moskow',
    description: destinationDescriptions[0],
    photos: [
      {
        src: `${IMG_FOLDER}/1.jpg`,
        alt: 'Event photo 1'
      },
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'London',
    description: destinationDescriptions[0].slice(150),
    photos: [
      {
        src: `${IMG_FOLDER}/2.jpg`,
        alt: 'Event photo 2'
      },
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'Amsterdam',
    description: destinationDescriptions[0].slice(1, 80),
    photos: []
  },
  {
    id: crypto.randomUUID(),
    name: 'New Zealand',
    description: destinationDescriptions[1],
    photos: [
      {
        src: `${IMG_FOLDER}/1.jpg`,
        alt: 'Event photo 1'
      },
      {
        src: `${IMG_FOLDER}/2.jpg`,
        alt: 'Event photo 2'
      },
      {
        src: `${IMG_FOLDER}/3.jpg`,
        alt: 'Event photo 3'
      },
    ]
  },
];

const offers = createOffers();

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

function getOfferIDs() {
  return offers.map((offer) => offer.id);
}

function createPoint(pointType) {
  return {
    type: pointType,
    destination: getRandomArrayElement(destinations),
    dates: {
      start: getMockDate(),
      end: getMockDate(true)
    },
    offers: getUniqRandomArrayElements(getOfferIDs()) || [],
    cost: getRandomInt(Price.MIN, Price.MAX),
    isFavorite: getRandomBoolean(),
  };
}

function getBlankPoint() {
  return newBlankPoint;
}

function getRandomPoint() {
  const pointType = getRandomArrayElement(pointTypes);

  return createPoint(pointType);
}

function getDestinations() {
  return destinations;
}


export {
  pointTypes,
  getBlankPoint,
  getRandomPoint,
  getDestinations,
  getOffers
};
