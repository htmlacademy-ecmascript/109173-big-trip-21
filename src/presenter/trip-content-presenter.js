import { render, RenderPosition } from '../framework/render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsList from '../view/trip-events-list-view.js';
import TripEventsListItem from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';

// Модели
import PointsModel from '../model/points-model.js';

export default class TripContentPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointsModel = null;
  #points = null;

  constructor() {
    this.#tripEventsContainer = document.querySelector('.trip-events'); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsList(); // Контейнер для списка точек маршрута
    this.#pointsModel = new PointsModel(); // Модель для получения данных о точках маршрута
  }

  init() {
    this.#points = this.#pointsModel.points.slice(); // Копируем полученный из модели массив с точками маршрута

    render(new TripSortView(), this.#tripEventsContainer); // Отрисовываем сортировку событий
    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для событий
    render(new EditPointView(this.#points[0]), this.#tripEventsListContainer.element, RenderPosition.AFTERBEGIN); // Отрисовываем форму редактирования первой точки маршрута

    for (let i = 1; i < this.#points.length; i++) { //Выводим не с первой точки, а со второй т.к. первая отводится под блок редактирования
      this.#renderEventPoint(this.#points[i]); // Отрисовываем события; // Отрисовываем события
    }
  }

  #renderEventPoint(point) {
    const pointComponent = new TripEventsListItem(point);

    render(pointComponent, this.#tripEventsListContainer.element);
  }
}
