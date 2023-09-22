import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration'; // Расширение для подсчета длительности (https://day.js.org/docs/en/durations/durations)
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // (https://day.js.org/docs/en/plugin/is-same-or-before)
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // (https://day.js.org/docs/en/plugin/is-same-or-after)

// Добавляем расширение в библиотеку
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const Duration = {
  MINUTE: 1440,
  HOUR: 24,
  DAY: 30
};

const DateFormats = {
  FLATPICKR: 'd/m/y H:i', // Для Флэтпикера
  DATE_TIME: 'YYYY-MM-DD[T]hh:mm', // Для тега datetime
  PATH: 'DD/MM/YY',
  DAY: 'DD',
  CHOSED_DATE: 'DD/MM/YY HH:mm', // Дата и время начала события
  FOR_POINT_PERIODS: 'HH:mm', // Для периодов, выбранных для точки маршрута
  FOR_POINT: 'MMM DD', // Дата для каждой конкретной точки маршрута
  // Форматирование продолжительности нахождения в точке маршрута
  LESS_THAN_HOUR: 'mm', // Менее часа
  LESS_THAN_DAY: 'HH mm', // Менее суток
  MORE_THAN_DAY: 'DD HH mm' // Более суток
};

const TimeInMillis = {
  MINUTE: 60 * 1000, // 60000
  HOUR: 3600 * 1000, // 3600000
  DAY: 24 * 3600 * 1000, // 86400000
};

function getRandomInt(min = 0, max = Infinity) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomArrayElement(arr) {
  const randomIndex = getRandomInt(0, arr.length - 1);
  return arr[randomIndex];
}

function getUniqRandomArrayElements(arr) {
  const elements = [];
  const elementsCount = getRandomInt(0, arr.length);

  for(let i = 0; i < elementsCount; i++) {
    const currentElem = getRandomArrayElement(arr);

    if (!elements.includes(currentElem)) {
      elements.push(currentElem);
    }
  }

  return elements;
}

function getRandomBoolean() {
  return Boolean(getRandomInt(0, 1));
}

// Получаем текущую дату с рандомным смещением в днях (в прошлое)
let baseDate = dayjs().subtract(getRandomInt(0, Duration.DAY), 'days');

/**
 *
 * @param {Boolean} addOffset Если true - добавляет рандомное смещение в минутах, часах и днях
 * @returns {String} baseDate Строка со сгенерированной датой
 */
function getMockDate(addOffset = false) {
  if (addOffset) {
    const minutesOffset = getRandomInt(0, Duration.MINUTE);
    const hoursOffset = getRandomInt(0, Duration.HOUR);
    const daysOffset = getRandomInt(0, Duration.DAY);

    baseDate = dayjs(baseDate)
      .add(minutesOffset, 'm')
      .add(hoursOffset, 'd')
      .add(daysOffset, 'h');
  }

  return baseDate.format(DateFormats.CHOSED_DATE);
}

// v.2 (на нативной функции)
function getFormattedDateDiff(date1, date2) {
  const dateFrom = dayjs(date1);
  const dateTo = dayjs(date2);
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
  let days = 0;
  let hours = 0;
  let minutes = 0;

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
  days = getPadded2ZeroNum(days);
  hours = getPadded2ZeroNum(hours);
  minutes = getPadded2ZeroNum(minutes);

  return {days, hours, minutes};
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

function findObjectByID(id, obj) {
  return obj.find((item) => item.id === id);
}

function updateItem(items, updatedItem) {
  return items.map((item) => (item.id === updatedItem.id) ? updatedItem : item);
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
  getRandomInt,
  getRandomArrayElement,
  getUniqRandomArrayElements,
  getRandomBoolean,
  getMockDate,
  getDateDiff,
  getFormattedDateDiff,
  DateFormats,
  isPastDate,
  isPresentDate,
  isFutureDate,
  normalizeDate,
  findObjectByID,
  updateItem,
  upperCaseFirst,
  removeChars,
  isEscKey,
  getIDs
};
