import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; // Расширение для подсчета длительности (https://day.js.org/docs/en/durations/durations)

dayjs.extend(duration); // Добавляем расширение в библиотеку

const DATE_FORMATS = {
  CHOSED_DATE: 'DD/MM/YY HH:mm', // Дата и время начала события
  FOR_POINT_PERIODS: 'HH:mm', // Для периодов, выбранных для точки маршрута
  FOR_POINT: 'MMM DD', // Дата для каждой конкретной точки маршрута
  // Форматирование продолжительности нахождения в точке маршрута
  LESS_THAN_HOUR: 'mm', // Менее часа
  LESS_THAN_DAY: 'HH mm', // Менее суток
  MORE_THAN_DAY: 'DD HH mm' // Более суток
};

const TIME_IN_MILLIS = {
  MINUTE: 60 * 1000, // 60000
  HOUR: 3600 * 1000, // 3600000
  DAY: 24 * 3600 * 1000, // 86400000
};

function getRandomInt(min = 0, max = Infinity) {
  return Math.floor(min + Math.random() * (max - min));
}

function getRandomArrayElement(arr) {
  const randomIndex = getRandomInt(0, arr.length);
  return arr[randomIndex];
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

// v.2 (на нативной функции)
function getFormattedDateDiff(date1, date2) {
  const dateDiff = Math.abs(dayjs(date2).diff(date1));
  const formattedDate = parseDateFromMillis(dateDiff);
  const formattedNums = [`${formattedDate.days}D`, `${formattedDate.hours}H`, `${formattedDate.minutes}M`];
  const filterredNums = Array.from(formattedNums).filter((datePart) => !/00\w/.test(datePart));

  return filterredNums.join(' ');
}

// Функция для получения дней, часов и минут в миллисекундах
function parseDateFromMillis(millis) {
  let milliseconds = millis;
  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (milliseconds >= TIME_IN_MILLIS.DAY) {
    days = Math.round(milliseconds / TIME_IN_MILLIS.DAY);
    milliseconds -= days * TIME_IN_MILLIS.DAY;
  }

  if (milliseconds >= TIME_IN_MILLIS.HOUR) {
    hours = Math.round(milliseconds / TIME_IN_MILLIS.HOUR);
    milliseconds -= hours * TIME_IN_MILLIS.DAY;
  }

  if (milliseconds > TIME_IN_MILLIS.MINUTE) {
    minutes = Math.round(milliseconds / TIME_IN_MILLIS.MINUTE);
    milliseconds -= hours * TIME_IN_MILLIS.MINUTE;
  }

  // Дополняем строку до двух символов 00D 00H 00M
  days = getPadded2ZeroNum(days);
  hours = getPadded2ZeroNum(hours);
  minutes = getPadded2ZeroNum(minutes);

  return {days, hours, minutes};
}

function getPadded2ZeroNum(num) {
  return String(num).padStart(2, 0);
}

export {getRandomArrayElement, getFormattedDateDiff, DATE_FORMATS};
