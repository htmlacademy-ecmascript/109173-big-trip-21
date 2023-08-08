import {render, RenderPosition} from '../render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripInfoMain from '../view/trip-info-main-view.js';
import TripInfoCost from '../view/trip-info-cost-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventsList from '../view/trip-events-list-view.js';
import TripEventsListItem from '../view/trip-events-list-item-view.js';
// import NewPointView from '../view/new-point-view.js';
import EditPointView from '../view/edit-point-view.js';

const TRIP_ELEMS_COUNT = 3;

export default class TripPresenter {
  constructor() {
    // Шапка
    this.tripMainContainer = document.querySelector('.trip-main'); // Контейнер для отрисовки общей информации о путешествии
    this.tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия

    // Контентная часть
    this.tripFilterContainer = document.querySelector('.trip-controls__filters'); // Контейнер для фильтров
    this.tripEventsContainer = document.querySelector('.trip-events'); // Общий контейнер для событий
    this.tripEventsListContainer = new TripEventsList(); // Контейнер для списка точек маршрута
  }

  init() {
    // Рендер шапки
    render(this.tripInfoContainer, this.tripMainContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(new TripInfoMain(), this.tripInfoContainer.getElement()); // Отрисовываем информацию о маршруте и датах
    render(new TripInfoCost(), this.tripInfoContainer.getElement()); // Отрисовываем информацию о цене
    render(new TripFilterView(), this.tripFilterContainer); // Отрисовываем фильтр событий

    // Рендер контентной части
    render(new TripSortView(), this.tripEventsContainer); // Отрисовываем сортировку событий
    render(this.tripEventsListContainer, this.tripEventsContainer); // Отрисовываем контейнер для событий
    // render(new NewPointView(), this.tripEventsListContainer.getElement(), RenderPosition.AFTERBEGIN); // Отрисовываем форму добавления новой точки для путешествия
    render(new EditPointView(), this.tripEventsListContainer.getElement(), RenderPosition.AFTERBEGIN); // Отрисовываем форму редактирования точки маршрута

    for (let i = 0; i < TRIP_ELEMS_COUNT; i++) {
      render(new TripEventsListItem(), this.tripEventsListContainer.getElement()); // Отрисовываем события
    }
  }
}
