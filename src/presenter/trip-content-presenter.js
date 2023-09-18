import { render, remove, RenderPosition } from '../framework/render.js';
import { filters } from '../utils/filter.js';
import { findObjectByID, upperCaseFirst } from '../utils/utils.js';
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

    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#sortModel.addObserver(this.#modelChangeHandler);
    this.#pointsModel.addObserver(this.#modelChangeHandler);
  }

  get points() {
    const currentFilter = this.#filterModel.filter;
    const filteredPoints = filters[currentFilter](this.#pointsModel.points);

    switch(this.#sortModel.sort) {
      case SortType.DAY: {
        return sorts[SortType.DAY](filteredPoints);
      }

      case SortType.EVENT: {
        return sorts[SortType.EVENT](filteredPoints);
      }

      case SortType.OFFERS: {
        return sorts[SortType.OFFERS](filteredPoints);
      }

      case SortType.PRICE: {
        return sorts[SortType.PRICE](filteredPoints);
      }

      case SortType.TIME: {
        return sorts[SortType.TIME](filteredPoints);
      }
    }

    return filteredPoints;
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

  #reRenderHeader() {
    remove(this.#tripInfoComponent);
    remove(this.#priceComponent);
    remove(this.#addNewPointBtnComponent);

    this.#renderHeader();
  }

  #renderTripBoard() {
    render(this.#tripEventsListContainer, this.#tripEventsContainer); // Отрисовываем контейнер для точек маршрута

    if (this.points.length > 0) {
      this.#renderEventPoints(this.points);
    } else {
      this.#renderNoPoints();
    }
  }

  #reRenderTripBoard() {
    this.#clearEventPoints();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    this.#renderTripBoard();
  }

  #renderNoPoints() {
    this.#noPointsComponent = new TripEventsListEmptyView();
    render(this.#noPointsComponent, this.#tripEventsListContainer.element);
  }

  #renderEventPoints(points) {
    points.forEach((point) => this.#renderEventPoint(point));
  }

  #renderEventPoint(point = BLANK_POINT) {
    const destinationsList = this.#destinationsModel.destinations;
    const pointPresenter = new TripPointPresenter({
      container: this.#tripEventsListContainer.element,
      destinationsList,
      offersModel: this.#offersModel,
      onChangeCallback: this.#viewChangeHandler,
      onBeforeEditCallback: this.#pointBeforeEditHandler,
      onCancelAddCallback: this.#newPointCancelAddingHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #reRenderEventPoints() {
    this.#clearEventPoints();
    this.#renderEventPoints(this.points);
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

  #setBoardMode(mode) {
    if(this.#currentTripBoardMode === mode) {
      return;
    }

    this.#currentTripBoardMode = mode;
  }

  /** Обработчики */
  /**
   * Вью с моделью взаимодействует только через данный метод
   */
  #viewChangeHandler = (actionType, updateType, data) => {
    console.log(actionType);
    switch(actionType) {
      case ActionType.CREATE_POINT: {
        this.#pointsModel.createPoint(updateType, data);
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
  #modelChangeHandler = (updateType, pointData) => {
    switch(updateType) {
      case UpdateType.PATCH: {
        this.#reRenderHeader();
        this.#pointPresenters.get(pointData.id).init(pointData); // Перерисовываем точку
        break;
      }

      case UpdateType.MINOR: {
        this.#reRenderHeader();
        this.#reRenderEventPoints();
        break;
      }

      case UpdateType.MAJOR: {
        // Перерисовываем весь список точек + сбрасываем сортировку (перерисовать всю доску)
        this.#reRenderHeader();
        this.#reRenderTripBoard();
        break;
      }
    }
  };

  #addNewPointBtnClickHandler = () => {
    if(this.#currentTripBoardMode === TripBoardMode.ADDING_NEW_POINT) {
      return;
    }

    // Добавление новой точки маршрута
    this.#setBoardMode(TripBoardMode.ADDING_NEW_POINT);
    this.#renderEventPoint();
    this.#pointBeforeEditHandler();
  };

  #newPointCancelAddingHandler = () => {
    this.#setBoardMode(TripBoardMode.DEFAULT);
  };

  #pointBeforeEditHandler = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };
}
