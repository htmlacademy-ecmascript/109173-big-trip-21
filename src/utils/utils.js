import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration'; // Расширение для подсчета длительности (https://day.js.org/docs/en/durations/durations)
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // (https://day.js.org/docs/en/plugin/is-same-or-before)
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // (https://day.js.org/docs/en/plugin/is-same-or-after)
import { DateFormats } from './const';

// Добавляем расширение в библиотеку
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const TimeInMillis = {
  MINUTE: 60 * 1000, // 60000
  HOUR: 3600 * 1000, // 3600000
  DAY: 24 * 3600000, // 86 400 000
  YEAR: 365 * 86400000, // 31 536 000 000
};

// v.2 (на нативной функции)
function getFormattedDateDiff(dateFrom, dateTo) {
  const dateDiff = getDateDiff(dateFrom, dateTo);
  const formattedDate = parseDateFromMillis(dateDiff);
  const formattedNums = [`${formattedDate.days}D`, `${formattedDate.hours}H`, `${formattedDate.minutes}M`];
  const filteredNums = Array.from(formattedNums).filter((datePart) => !/00\w/.test(datePart));

  return filteredNums.join(' ');
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
    years = Math.round(milliseconds / TimeInMillis.YEAR);
    milliseconds -= years * TimeInMillis.YEAR;
  }

  if (milliseconds >= TimeInMillis.DAY) {
    days = Math.round(milliseconds / TimeInMillis.DAY);
    milliseconds -= days * TimeInMillis.DAY;
  }

  if (milliseconds >= TimeInMillis.HOUR) {
    hours = Math.round(milliseconds / TimeInMillis.HOUR);
    milliseconds -= hours * TimeInMillis.DAY;
  }

  if (milliseconds > TimeInMillis.MINUTE) {
    minutes = Math.round(milliseconds / TimeInMillis.MINUTE);
    milliseconds -= hours * TimeInMillis.MINUTE;
  }

  // Дополняем строку до двух символов 00D 00H 00M
  years = getPadded2ZeroNum(years);
  days = getPadded2ZeroNum(days);
  hours = getPadded2ZeroNum(hours);
  minutes = getPadded2ZeroNum(minutes);

  return {years, days, hours, minutes};
}

function isPastDate(dateTo) {
  dateTo = dayjs(dateTo, DateFormats.CHOSED_DATE);

  return dateTo && dayjs().isAfter(dateTo, 'H');
}

function isPresentDate(dateFrom, dateTo) {
  dateFrom = dayjs(dateFrom, DateFormats.CHOSED_DATE);
  dateTo = dayjs(dateTo, DateFormats.CHOSED_DATE);

  return dayjs().isSameOrAfter(dateFrom, 'H') && dayjs().isSameOrBefore(dateTo, 'H');
}

function isFutureDate(dateFrom) {
  dateFrom = dayjs(dateFrom, DateFormats.CHOSED_DATE);
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

function upperCaseFirst(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function getIDs(itemsObj) {
  return itemsObj.map((item) => item.id);
}

export {
  getDateDiff,
  getFormattedDateDiff,
  DateFormats,
  isPastDate,
  isPresentDate,
  isFutureDate,
  normalizeDate,
  findObjectByID,
  upperCaseFirst,
  removeChars,
  isEscKey,
  getIDs
};
