import { render, replace } from '../framework/render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsListItemView from '../view/trip-events-list-item-view.js';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view.js';
import EditPointView from '../view/edit-point-view.js';
import { isEscKey } from '../utils/utils.js';

// Модели
import PointsModel from '../model/points-model.js';

export default class TripContentPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointsModel = null;
  #points = null;

  /**
   * @property {Object | null} previousEditingPoint Объект с информацией о предыдущей редактируемой точке
   * @property {TripEventsListItemView} previousEditingPoint.point View точки маршрута
   * @property {EditPointView} previousEditingPoint.form View формы редактированияточки маршрута
   * @property {Object}  previousEditingPoint.handler KeyDownHandler точки маршрута
   */
  #previousEditingPoint = null;

  constructor() {
    this.#tripEventsContainer = document.querySelector('.trip-events'); // Общий контейнер для событий
    this.#tripEventsListContainer = new TripEventsListView(); // Контейнер для списка точек маршрута
    this.#pointsModel = new PointsModel(); // Модель для получения данных о точках маршрута
  }

  init() {
    this.#points = this.#pointsModel.points.slice(); // Копируем полученный из модели массив с точками маршрута

    render(new TripSortView(), this.#tripEventsContainer); // Отрисовываем сортировку событий
    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для событий

    if (this.#points.length > 0) {
      for (let i = 0; i < this.#points.length; i++) { //Выводим не с первой точки, а со второй т.к. первая отводится под блок редактирования
        this.#renderEventPoint(this.#points[i]); // Отрисовываем события; // Отрисовываем события
      }
    } else { // Если у нас нет ни одной точки маршрута
      render(new TripEventsListEmptyView(), this.#tripEventsListContainer.element);
    }
  }

  get points() {
    return this.#points;
  }

  #renderEventPoint(point) {
    // Обработчики событий (через bind из за необходимости hoisting некоторых функций)
    point.pointEditCallback = pointEditHandler.bind(this);
    point.pointFinishEditCallback = pointFinishEditHandler.bind(this);
    point.pointSubmitCallback = pointSubmitHandler.bind(this);

    const pointComponent = new TripEventsListItemView(point); // Точка маршрута
    const editPointComponent = new EditPointView(point); // Форма редактирования точки маршрута
    const bindedDocumentKeyDownHandler = documentKeyDownHandler.bind(this);

    function documentKeyDownHandler(evt) {
      if (isEscKey(evt)) {
        evt.preventDefault();
        this.#previousEditingPoint = null;
        replaceFormToPoint();
      }

      document.removeEventListener('keydown', bindedDocumentKeyDownHandler);
    }

    function pointEditHandler() {
      // Если во время редактирования точки маршрута попытаться открыть другую - закроем текущую.
      if (this.#previousEditingPoint !== null &&
          this.#previousEditingPoint.point !== pointComponent) {
        replace(this.#previousEditingPoint.point, this.#previousEditingPoint.form);
        document.removeEventListener('keydown', this.#previousEditingPoint.handler);
      }

      /*
        Каждый раз сохраняем компоненты редактирования
        для возможности обратиться к ним при редактировании следующей точки
        (чтобы иметь возможность закрыть текущую редактируемую точку и открыть новую)
      */
      this.#previousEditingPoint = {
        point: pointComponent,
        form: editPointComponent,
        handler: bindedDocumentKeyDownHandler
      };

      document.addEventListener('keydown', bindedDocumentKeyDownHandler);
      replacePointToForm();
    }

    function pointFinishEditHandler() { // Пока Callback такой же, как и для отправки формы, но, наверняка дальше они будут разными
      this.#previousEditingPoint = null;
      replaceFormToPoint();
    }

    function pointSubmitHandler() {
      this.#previousEditingPoint = null;
      replaceFormToPoint();
    }

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
