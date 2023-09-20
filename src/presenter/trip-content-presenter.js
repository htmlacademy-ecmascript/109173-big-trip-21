import { render, remove, RenderPosition } from '../framework/render.js';
import { FilterType, filters } from '../utils/filter.js';
import { findObjectByID } from '../utils/utils.js';
import { SortType, sorts } from '../utils/sort.js';
import { BLANK_POINT, ActionType, UpdateType, TripBoardMode } from '../utils/const.js';

import TripInfoView from '../view/trip-info-view.js';
import TripInfoMainView from '../view/trip-info-main-view.js';
import TripInfoPriceView from '../view/trip-info-price-view.js';
import AddNewPointBtnView from '../view/add-new-point-btn-view.js';

import TripPointPresenter from './trip-point-presenter.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view.js';

export default class TripContentPresenter {
  #mainHeaderContainer = null;
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #addNewPointBtnComponent = null;
  #priceComponent = null;
  #tripEventsContainer = null;
  #tripEventsListContainer = null;

  #sortComponent = null;
  #noPointsComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #sortModel = null;

  #pointPresenters = new Map();

  #currentTripBoardMode = TripBoardMode.DEFAULT;

  constructor({
    mainHeaderContainer,
    eventsContainer,
    destinationsModel,
    offersModel,
    filterModel,
    sortModel,
    pointsModel
  }) {
    this.#mainHeaderContainer = mainHeaderContainer;
    this.#tripInfoContainer = new TripInfoView(); // Контейнер для отрисовки информации о маршруте, датах и стоимости путешествия
    this.#tripEventsContainer = eventsContainer;
    this.#tripEventsListContainer = new TripEventsListView(); // Контейнер для списка точек маршрута

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#filterModelChangeHandler);
    this.#sortModel.addObserver(this.#sortModelChangeHandler);
    this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
  }

  get points() {
    const currentFilter = this.#filterModel.filter;
    const filteredPoints = filters[currentFilter](this.#pointsModel.points);

    return sorts[this.#sortModel.sort](filteredPoints);
  }

  init() {
    this.#renderHeader();
    this.#renderTripBoard();
  }

  #renderHeader() {
    this.#tripInfoComponent = new TripInfoMainView({ pointsInfo: this.#getPointsInfo() });
    this.#priceComponent = new TripInfoPriceView({ price: this.#getCurrentPrice() });
    this.#addNewPointBtnComponent = new AddNewPointBtnView({ onAddNewPointCallback: this.#addNewPointBtnClickHandler });

    render(this.#tripInfoContainer, this.#mainHeaderContainer, RenderPosition.AFTERBEGIN); // Отрисовываем контейнер для общей информации о маршруте
    render(this.#tripInfoComponent, this.#tripInfoContainer.element); // Отрисовываем информацию о маршруте и датах
    render(this.#priceComponent, this.#tripInfoContainer.element); // Отрисовываем информацию о цене
    render(this.#addNewPointBtnComponent, this.#mainHeaderContainer); // Отрисовываем кнопку добавления новой точки
  }

  #renderTripBoard() {
    const points = this.points;

    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для точек маршрута

    if (points.length > 0) {
      this.#renderEventPoints(points);
      return;
    }

    if(this.#getBoardMode() !== TripBoardMode.ADDING_NEW_POINT) {
      this.#renderNoPoints();
    }
  }

  #reRenderHeader() {
    remove(this.#tripInfoComponent);
    remove(this.#priceComponent);
    remove(this.#addNewPointBtnComponent);

    this.#renderHeader();
  }

  #reRenderTripBoard() {
    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    this.#clearEventPoints();
    this.#renderTripBoard();
  }

  #renderNoPoints() {
    this.#noPointsComponent = new TripEventsListEmptyView({ currentFilter: this.#filterModel.filter });
    render(this.#noPointsComponent, this.#tripEventsListContainer.element);
  }

  #renderEventPoints(points) {
    points.forEach((point) => this.#renderEventPoint(point));
  }

  #renderEventPoint(point = BLANK_POINT) {
    const isNewPoint = (point === BLANK_POINT);
    const destinationsList = this.#destinationsModel.destinations;
    const pointPresenter = new TripPointPresenter({
      point,
      container: this.#tripEventsListContainer.element,
      destinationsList,
      offersModel: this.#offersModel,
      onChangeCallback: this.#viewChangeHandler,
      onBeforeEditCallback: this.#pointBeforeEditHandler,
      setBoardMode: this.#setBoardMode,
      isNewPoint,
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearEventPoints() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #getCurrentPrice() {
    return [...this.#pointsModel.points].reduce((accumulator, point) => accumulator + Number(point.cost), 0);
  }

  #getPointsInfo() {
    return [...this.#pointsModel.points].map(({ destination, dates }) => {
      const destinationInfo = findObjectByID(destination, this.#destinationsModel.destinations)?.name;
      return {
        destination: destinationInfo, // <- перевести id пунктов назначения в названия
        dateFrom: dates.start,
        dateTo: dates.end
      };
    });
  }

  // Используем стрелку для привязки контекста
  #setBoardMode = (mode) => {
    const modes = Object.values(TripBoardMode);

    if(this.#currentTripBoardMode === mode || !modes.includes(mode)) {
      return;
    }

    this.#currentTripBoardMode = mode;
  };

  #getBoardMode = () => this.#currentTripBoardMode;

  #resetFilters({ updateType, resetFilter, resetSort }) {
    if(resetFilter && this.#filterModel.filter !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(updateType, FilterType.EVERYTHING);
    }

    if(resetSort && this.#sortModel.sort !== SortType.DAY) {
      this.#sortModel.setSort(updateType, SortType.DAY);
    }
  }

  /** Обработчики */
  /**
   * Вью с моделью взаимодействует только через данный метод
   */
  #viewChangeHandler = (actionType, updateType, data) => {
    switch(actionType) {
      case ActionType.CREATE_POINT: {
        // Создание точки без добавления в модель (например, при клике на кнопку + New event)
        this.#setBoardMode(TripBoardMode.ADDING_NEW_POINT);
        this.#resetFilters({ updateType, resetFilter: true, resetSort: true });
        this.#reRenderTripBoard();
        this.#renderEventPoint();
        break;
      }

      case ActionType.CANCEL_CREATING_POINT: {
        this.#reRenderTripBoard();
        break;
      }

      case ActionType.ADD_POINT: {
        this.#pointsModel.addPoint(updateType, data);
        break;
      }

      case ActionType.UPDATE_POINT: {
        this.#pointsModel.updatePoint(updateType, data);
        break;
      }

      case ActionType.DELETE_POINT: {
        this.#pointsModel.deletePoint(updateType, data);
        break;
      }
    }
  };

  // Отслеживание изменения данных на сервере
  #pointsModelChangeHandler = (updateType, pointData) => {
    switch(updateType) {
      case UpdateType.PATCH: {
        this.#pointPresenters.get(pointData.id).init(pointData); // Перерисовываем точку
        break;
      }

      case UpdateType.MINOR: {
        this.#reRenderTripBoard();
        break;
      }

      case UpdateType.MAJOR: {
        this.#reRenderHeader();
        this.#reRenderTripBoard();
        break;
      }
    }
  };

  #filterModelChangeHandler = (updateType) => {
    switch(updateType) {
      case UpdateType.MINOR: {
        this.#resetFilters({ updateType, resetSort: true });
        this.#reRenderTripBoard();
        break;
      }
    }
  };

  #sortModelChangeHandler = (updateType) => {
    switch(updateType) {
      case UpdateType.MINOR: {
        this.#reRenderTripBoard();
        break;
      }
    }
  };

  #addNewPointBtnClickHandler = () => {
    if(this.#getBoardMode() === TripBoardMode.ADDING_NEW_POINT) {
      return;
    }

    this.#viewChangeHandler(ActionType.CREATE_POINT, UpdateType.MINOR);
  };

  #pointBeforeEditHandler = () => this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
}
