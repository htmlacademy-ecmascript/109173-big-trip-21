import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripContentPresenter from './presenter/trip-content-presenter.js';

const tripHeaderPresenter = new TripHeaderPresenter();
const tripContentPresenter = new TripContentPresenter();

tripContentPresenter.init();
tripHeaderPresenter.init(tripContentPresenter.points);
