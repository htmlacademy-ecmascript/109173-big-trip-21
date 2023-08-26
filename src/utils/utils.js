import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; // Расширение для подсчета длительности (https://day.js.org/docs/en/durations/durations)

dayjs.extend(duration); // Добавляем расширение в библиотеку

const Duration = {
  MINUTE: 1440,
  HOUR: 24,
  DAY: 30
};

const DateFormats = {
  DATE_TIME: 'YYYY-MM-DD[T]hh:mm', // Для тега datetime
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

// TODO: Неверно считает - переделать
// function getFormattedDateDiff(date1, date2) {
//   const dateDiff = Math.abs(dayjs(date2).diff(date1));
//   let formattedDate = dayjs.duration(dateDiff).format('DD[D] HH[H] mm[M]');
//   const filterredNums = formattedDate.filter((datePart) => !/00\w/.test(datePart));

//   // console.log(date1, date2, dateDiff, formattedDate);
//   // console.log(date1, date2, dateDiff, parseDateFromMillis(dateDiff));

//   return filterredNums.join(' ');
// }

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

  return baseDate;
}

// v.2 (на нативной функции)
function getFormattedDateDiff(date1, date2) {
  const dateDiff = Math.abs(dayjs(date2).diff(date1));
  const formattedDate = parseDateFromMillis(dateDiff);
  const formattedNums = [`${formattedDate.days}D`, `${formattedDate.hours}H`, `${formattedDate.minutes}M`];
  const filteredNums = Array.from(formattedNums).filter((datePart) => !/00\w/.test(datePart));

  return filteredNums.join(' ');
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
  return dateTo && dayjs().isAfter(dateTo, 'H');
}

function isPresentDate(dateTo) {
  return dateTo && dayjs().isSame(dateTo, 'H');
}

function isFutureDate(dateTo) {
  return dateTo && dayjs().isBefore(dateTo, 'H');
}

function getPadded2ZeroNum(num) {
  return String(num).padStart(2, 0);
}

function findObjectByID(id, obj) {
  return obj.find((item) => item.id === id);
}

function isEscKey(evt) {
  return evt.key === 'Escape';
}

export {
  getRandomInt,
  getRandomArrayElement,
  getUniqRandomArrayElements,
  getRandomBoolean,
  getMockDate,
  getFormattedDateDiff,
  DateFormats,
  isPastDate,
  isPresentDate,
  isFutureDate,
  findObjectByID,
  isEscKey
};
