import {getRandomArrayElement} from '../utils.js';

const pointTypes = new Set(['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant']);

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
    name: 'Moskow',
    description: destinationDescriptions[0],
    photos: ['way/to/photos/1.jpg', 'way/to/photos/2.jpg', 'way/to/photos/3.jpg']
  },
  {
    name: 'London',
    description: destinationDescriptions[0].slice(150),
    photos: ['way/to/photos/3.jpg']
  },
  {
    name: 'Amsterdam',
    description: destinationDescriptions[0].slice(200, 150),
    photos: []
  },
  {
    name: 'New Zealand',
    description: destinationDescriptions[1],
    photos: ['way/to/photos/1.jpg', 'way/to/photos/2.jpg', 'way/to/photos/3.jpg']
  },
];

const offers = [
  {
    name: 'Transfer',
    cost: 80,
    checked: true,
  },
  {
    name: 'Meet in Airport',
    cost: 100,
    checked: false,
  },
  {
    name: 'Lunch',
    cost: 320,
    checked: true,
  },
  {
    name: 'Extra Luggage',
    cost: 150,
    checked: true,
  },
  {
    name: 'Switch to comfort',
    cost: 80,
    checked: true,
  },
];

const mockWayPoints = [
  {
    type: pointTypes.get('Flight'),
    destinations: destinations,
    dates: {
      start: '25/12/19 16:00',
      end: '01/08/2020 00:00'
    },
    offers: offers,
    cost: 5000,
    isFavorite: true,
  },

  {
    type: pointTypes.get('Ship'),
    destinations: [],
    dates: {
      start: '10/08/2023 11:39',
      end: '12/08/2023 14:00'
    },
    offers: [offers[0], offers[1], offers[2]],
    cost: 1000,
    isFavorite: false,
  },

  {
    type: pointTypes.get('Check-in'),
    destination: [destinations[2]],
    dates: {
      start: '01/02/2021 03:00',
      end: '26/09/2023 03:00'
    },
    offers: [],
    cost: 400,
    isFavorite: false,
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockWayPoints);
}


export {getRandomPoint};
