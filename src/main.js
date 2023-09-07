import TripHeaderPresenter from './presenter/trip-header-presenter.js';
import TripContentPresenter from './presenter/trip-content-presenter.js';

/** TODO: Объеденить хэдер и контентную часть в один презентер для упрощения работы с фильтрацией? */

const tripHeaderPresenter = new TripHeaderPresenter();
const tripContentPresenter = new TripContentPresenter();

tripContentPresenter.init();
tripHeaderPresenter.init(tripContentPresenter);
