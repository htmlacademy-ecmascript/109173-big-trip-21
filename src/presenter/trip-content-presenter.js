import { render, RenderPosition } from '../render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsList from '../view/trip-events-list-view.js';
import TripEventsListItem from '../view/trip-events-list-item-view.js';
import EditPointView from '../view/edit-point-view.js';

// Модели
import PointsModel from '../model/points-model.js';

export default class TripContentPresenter {
  constructor() {
    this.tripEventsContainer = document.querySelector('.trip-events'); // Общий контейнер для событий
    this.tripEventsListContainer = new TripEventsList(); // Контейнер для списка точек маршрута
    this.pointsModel = new PointsModel(); // Модель для получения данных о точках маршрута
  }

  init() {
    this.points = this.pointsModel.getPoints().slice(); // Копируем полученный из модели массив с точками маршрута

    render(new TripSortView(), this.tripEventsContainer); // Отрисовываем сортировку событий
    render(this.tripEventsListContainer, this.tripEventsContainer); // Отрисовываем контейнер для событий
    render(new EditPointView(this.points[0]), this.tripEventsListContainer.getElement(), RenderPosition.AFTERBEGIN); // Отрисовываем форму редактирования первой точки маршрута
    // render(new EditPointView(), this.tripEventsListContainer.getElement(), RenderPosition.AFTERBEGIN); // Форма создания новой точки (форма редактирования с пустым конструктором)

    for (let i = 1; i < this.points.length; i++) { //Выводим не с первой точки, а со второй т.к. первая отводится под блок редактирования
      render(new TripEventsListItem(this.points[i]), this.tripEventsListContainer.getElement()); // Отрисовываем события
    }
  }
}
