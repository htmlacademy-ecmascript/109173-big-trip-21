import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripContentPresenter from './presenter/trip-content-presenter.js';

const tripHeaderPresenter = new TripHeaderPresenter();
const tripContentPresenter = new TripContentPresenter();

tripHeaderPresenter.init();
tripContentPresenter.init();
