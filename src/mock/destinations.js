import {
  getRandomInt,
  getRandomArrayElement,
  getIDs
} from '../utils/utils.js';

const CITY_NAMES = ['Moskow', 'London', 'Amsterdam', 'New Zealand'];
const RANDOM_PHOTOS_SERVICE_URL = 'https://loremflickr.com/248/152?random=';
const PhotoCount = {MIN: 0, MAX: 4};
const PhotoAltLength = {MIN: 30, MAX: 100};
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

function createDestinations() {
  return CITY_NAMES.slice().map((city) => ({
    id: crypto.randomUUID(),
    name: city,
    description: getRandomArrayElement(destinationDescriptions),
    pictures: Array.from({length: getRandomInt(PhotoCount.MIN, PhotoCount.MAX)}, getRandomPhoto)
  }));
}

function getRandomDestination(destinations) {
  return getRandomArrayElement(getIDs(destinations));
}

function getRandomPhoto() {
  const randomAlt = getRandomArrayElement(destinationDescriptions);
  return {
    src: `${RANDOM_PHOTOS_SERVICE_URL}${crypto.randomUUID()}`,
    alt: randomAlt.slice(0, getRandomInt(PhotoAltLength.MIN, PhotoAltLength.MAX)),
  };
}

export { createDestinations, getRandomDestination };
