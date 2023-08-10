import { render, RenderPosition } from '../render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsList from '../view/trip-events-list-view.js';
import TripEventsListItem from '../view/trip-events-list-item-view.js';
// import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';

// Модели
import PointsModel from '../model/points-model.js';

const TRIP_ELEMS_COUNT = 3;

export default class TripContentPresenter {
  constructor() {
    this.tripEventsContainer = document.querySelector('.trip-events'); // Общий контейнер для событий
    this.tripEventsListContainer = new TripEventsList(); // Контейнер для списка точек маршрута
    this.pointsModel = new PointsModel(); // Модель дл получения данных о точках маршрута
  }

  init() {
    this.points = this.pointsModel.getPoints().slice(); // Копируем полученный из модели массив с точками маршрута

    render(new TripSortView(), this.tripEventsContainer); // Отрисовываем сортировку событий
    render(this.tripEventsListContainer, this.tripEventsContainer); // Отрисовываем контейнер для событий
    // render(new NewPointView(), this.tripEventsListContainer.getElement(), RenderPosition.AFTERBEGIN); // Отрисовываем форму добавления новой точки для путешествия
    render(new EditPointView(), this.tripEventsListContainer.getElement(), RenderPosition.AFTERBEGIN); // Отрисовываем форму редактирования точки маршрута

    for (let i = 0; i < TRIP_ELEMS_COUNT; i++) {
      render(new TripEventsListItem(this.points[i]), this.tripEventsListContainer.getElement()); // Отрисовываем события
    }
  }
}
