import { createDestinations } from '../mock/destinations.js';
import {
  getRandomArrayElement,
  getIDs
} from '../utils/utils.js';

export default class DestinationsModel {
  #destinations = null;

  constructor() {
    this.#destinations = createDestinations();
  }

  get destinations() {
    return this.#destinations;
  }

  getRandomDestination() {
    const destinationIDs = getIDs(this.#destinations);

    return getRandomArrayElement(destinationIDs);
  }

}
