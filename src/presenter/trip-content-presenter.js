import { render, replace } from '../framework/render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsList from '../view/trip-events-list-view.js';
import TripEventsListItem from '../view/trip-events-list-item-view.js';
import TripEventsListEmpty from '../view/trip-events-list-empty-view.js';
import EditPointView from '../view/edit-point-view.js';
import { isEscKey } from '../utils.js';

// Модели
import PointsModel from '../model/points-model.js';

export default class TripContentPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointsModel = null;
  #points = null;
  #pointIsEditing = false; // Редактируется ли в текущий момент какая-либо форма (для запрета открытия более одной формы)

  constructor() {
    this.#tripEventsContainer = document.querySelector('.trip-events'); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsList(); // Контейнер для списка точек маршрута
    this.#pointsModel = new PointsModel(); // Модель для получения данных о точках маршрута
  }

  init() {
    this.#points = this.#pointsModel.points.slice(); // Копируем полученный из модели массив с точками маршрута
    this.#points = 0;

    render(new TripSortView(), this.#tripEventsContainer); // Отрисовываем сортировку событий
    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для событий

    if (this.#points.length > 0) {
      for (let i = 0; i < this.#points.length; i++) { //Выводим не с первой точки, а со второй т.к. первая отводится под блок редактирования
        this.#renderEventPoint(this.#points[i]); // Отрисовываем события; // Отрисовываем события
      }
    } else { // Если у нас нет ни одной точки маршрута
      render(new TripEventsListEmpty(), this.#tripEventsListContainer.element);
    }
  }

  #renderEventPoint(point) {
    /**
     * TODO:
     * реализовать закрытие всех открытых окон редактирования при откртии нового ?
     */
    const documentKeyDownHandler = (evt) => {
      if (!this.#pointIsEditing) {
        return;
      }

      if (isEscKey(evt)) {
        evt.preventDefault();
        this.#pointIsEditing = false;
        replaceFormToPoint();
      }

      document.removeEventListener('keydown', documentKeyDownHandler);
    };

    const pointEditHandler = () => { // Используем стрелку для запоминания контекста вызова
      if (this.#pointIsEditing) { // Пока запрещаем открытие доп. окон редактирования
        return;
      }

      this.#pointIsEditing = true;
      document.addEventListener('keydown', documentKeyDownHandler);
      replacePointToForm();
    };

    const pointFinishEditHandler = () => { // Пока Callback такой же, как и для отправки формы, но, наверняка дальше они будут разными
      this.#pointIsEditing = false;
      replaceFormToPoint();
    };

    const pointSubmitHandler = () => {
      this.#pointIsEditing = false;
      replaceFormToPoint();
    };

    // Обработчики событий
    point.pointEditCallback = () => pointEditHandler();
    point.pointFinishEditCallback = () => pointFinishEditHandler();
    point.pointSubmitCallback = () => pointSubmitHandler();

    const pointComponent = new TripEventsListItem(point); // Точка маршрута
    const editPointComponent = new EditPointView(point); // Форма редактирования точки маршрута

    // Используем функцию, т.к. нужно поднятие
    function replacePointToForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editPointComponent);
    }

    render(pointComponent, this.#tripEventsListContainer.element);
  }
}
