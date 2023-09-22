import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateFormats } from './utils/utils';

dayjs.extend(customParseFormat);

export default class Adapter {
  static adaptPointToServer(point) {
    console.log(point);
  }

  static adaptPointToClient(point) {
    const adaptedPoint = {
      ...point,
      dates: {
        start: dayjs(point.date_from, DateFormats.CHOSED_DATE).format(DateFormats.CHOSED_DATE),
        end: dayjs(point.date_to, DateFormats.CHOSED_DATE).format(DateFormats.CHOSED_DATE),
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
