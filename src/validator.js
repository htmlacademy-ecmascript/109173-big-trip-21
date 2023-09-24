import Pristine from 'pristinejs';

const defaultConfig = {
  classTo: 'event__field-group',
  errorClass: 'has-error',
  errorTextParent: 'event__field-group',
  errorTextTag: 'span',
  errorTextClass: 'event__input-error'
};

const CSSIDs = {
  DESTINATION: '#event-destination-1',
  DATE_FROM: '#event-start-time-1',
  DATE_TO: '#event-end-time-1',
  PRICE: '#event-price-1'
};

const ErrorMessage = {
  DESTINATION: 'Please, check point destination',
  DATE_FROM: 'Please, set point start-date',
  DATE_TO: 'Please, set point end-date',
  PRICE: 'Please, set point price. It must be more then 0'
};

export default class Validator {
  validatingElement = null;
  pristine = null;

  constructor(validatingElement) {
    this.validatingElement = validatingElement.querySelector('form');
  }

  init() {
    if(!this.validatingElement) {
      return;
    }

    this.pristine = new Pristine(this.validatingElement, defaultConfig);

    this.pristine.addValidator(
      this.validatingElement.querySelector(CSSIDs.DESTINATION),
      this.destinationValidateHandler,
      ErrorMessage.DESTINATION,
      1
    );

    this.pristine.addValidator(
      this.validatingElement.querySelector(CSSIDs.DATE_FROM),
      this.dateFromValidateHandler,
      ErrorMessage.DATE_FROM,
      2
    );

    this.pristine.addValidator(
      this.validatingElement.querySelector(CSSIDs.DATE_TO),
      this.dateToValidateHandler,
      ErrorMessage.DATE_TO,
      3
    );

    this.pristine.addValidator(
      this.validatingElement.querySelector(CSSIDs.PRICE),
      this.priceValidateHandler,
      ErrorMessage.PRICE,
      4
    );
  }

  validate() {
    return this.pristine.validate();
  }

  destinationValidateHandler = (destination) => (destination.length > 0);
  dateFromValidateHandler = (dateFrom) => Boolean(dateFrom);
  dateToValidateHandler = (dateTo) => Boolean(dateTo);
  priceValidateHandler = (price) => (price > 0);
}
