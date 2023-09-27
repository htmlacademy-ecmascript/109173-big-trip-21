import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatesFormat } from './utils/const.js';

dayjs.extend(customParseFormat);
export default class Adapter {
  static pointToServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': dayjs(point.dates.start, DatesFormat.CHOSEN_DATE).toISOString(),
      'date_to': dayjs(point.dates.end, DatesFormat.CHOSEN_DATE).toISOString(),
      'base_price': point.cost,
      'is_favorite': point.isFavorite,
      offers: Array.from(point.offers),
    };

    delete adaptedPoint.dates;
    delete adaptedPoint.cost;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  static pointToClient(point) {
    const adaptedPoint = {
      ...point,
      dates: {
        start: dayjs(point.date_from).format(DatesFormat.CHOSEN_DATE),
        end: dayjs(point.date_to).format(DatesFormat.CHOSEN_DATE),
      },
      offers: new Set(point.offers),
      cost: point.base_price,
      isFavorite: point.is_favorite
    };

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }
}
