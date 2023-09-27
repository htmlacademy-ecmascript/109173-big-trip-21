import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration'; // Расширение для подсчета длительности (https://day.js.org/docs/en/durations/durations)
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // (https://day.js.org/docs/en/plugin/is-same-or-before)
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // (https://day.js.org/docs/en/plugin/is-same-or-after)
import { DatesFormat } from './const';

// Добавляем расширение в библиотеку
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const TimeInMillis = {
  MINUTE: 60 * 1000, // 60000
  HOUR: 60 * 60000, // 3 600 000
  DAY: 24 * 3600000, // 86 400 000
  YEAR: 365 * 86400000, // 31 536 000 000
};

function getFormattedDateDiff(dateFrom, dateTo) {
  const dateDiff = getDateDiff(dateFrom, dateTo);
  const parsedDate = parseDateFromMillis(dateDiff);
  const daysStr = `${getPadded2ZeroNum(parsedDate.days)}D`;
  const hoursStr = `${getPadded2ZeroNum(parsedDate.hours)}H`;
  const minutesStr = `${getPadded2ZeroNum(parsedDate.minutes)}M`;

  let datesDeltaStr = '';

  switch(true) {
    case (parsedDate.days > 0): {
      datesDeltaStr = `${daysStr} ${hoursStr} ${minutesStr}`;
      break;
    }

    case (parsedDate.hours > 0): {
      datesDeltaStr = `${hoursStr} ${minutesStr}`;
      break;
    }

    case (parsedDate.minutes > 0): {
      datesDeltaStr = `${minutesStr}`;
      break;
    }
  }

  return datesDeltaStr;
}

function getDateDiff(dateFrom, dateTo) {
  return Math.abs(dateTo.diff(dateFrom));
}

// Функция для получения дней, часов и минут в миллисекундах
function parseDateFromMillis(millis) {
  let milliseconds = millis;
  let years = 0;
  let days = 0;
  let hours = 0;
  let minutes = 0;

  if(milliseconds >= TimeInMillis.YEAR) {
    years = Math.trunc(milliseconds / TimeInMillis.YEAR);
    milliseconds -= years * TimeInMillis.YEAR;
  }

  if (milliseconds >= TimeInMillis.DAY) {
    days = Math.trunc(milliseconds / TimeInMillis.DAY);
    milliseconds -= days * TimeInMillis.DAY;
  }

  if (milliseconds >= TimeInMillis.HOUR) {
    hours = Math.trunc(milliseconds / TimeInMillis.HOUR);
    milliseconds -= hours * TimeInMillis.DAY;
  }

  if (milliseconds > TimeInMillis.MINUTE) {
    minutes = Math.trunc(milliseconds / TimeInMillis.MINUTE);
    milliseconds -= minutes * TimeInMillis.MINUTE;
  }

  return { days, hours, minutes };
}

function isPastDate(dateTo) {
  dateTo = dayjs(dateTo, DatesFormat.CHOSEN_DATE);

  return dateTo && dayjs().isAfter(dateTo, 'H');
}

function isPresentDate(dateFrom, dateTo) {
  dateFrom = dayjs(dateFrom, DatesFormat.CHOSEN_DATE);
  dateTo = dayjs(dateTo, DatesFormat.CHOSEN_DATE);

  return dayjs().isSameOrAfter(dateFrom, 'H') && dayjs().isSameOrBefore(dateTo, 'H');
}

function isFutureDate(dateFrom) {
  dateFrom = dayjs(dateFrom, DatesFormat.CHOSEN_DATE);
  return dateFrom && dayjs().isBefore(dateFrom, 'H');
}

function normalizeDate(date, format, filler = '') {
  const formattedDate = date.format(format);

  return (formattedDate !== 'Invalid Date') ? formattedDate : filler;
}

function getPadded2ZeroNum(num) {
  return String(num).padStart(2, 0);
}

function findObjectByID(id, objectsList) {
  if(typeof objectsList !== 'object') {
    return;
  }

  return objectsList.find((object) => object.id === id);
}

function removeChars(str) {
  return str.replace(/\D*/gui, '');
}

function isEscKey(evt) {
  return evt.key === 'Escape';
}

function capitalize(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function getIDs(itemsObj) {
  return itemsObj.map((item) => item.id);
}

export {
  getDateDiff,
  getFormattedDateDiff,
  isPastDate,
  isPresentDate,
  isFutureDate,
  normalizeDate,
  findObjectByID,
  capitalize,
  removeChars,
  isEscKey,
  getIDs
};
