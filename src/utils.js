import dayjs from 'dayjs';

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
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
};

function getRandomInt(min = 0, max = Infinity) {
  return Math.floor(min + Math.random() * (max - min));
}

function getRandomArrayElement(arr) {
  const randomIndex = getRandomInt(0, arr.length);
  return arr[randomIndex];
}

// TODO: Неверно считает - переделать
function getFormattedDateDiff(date1, date2) {
  const dateDiff = dayjs(date2).diff(date1);
  let formattedDate = null;

  if (dateDiff <= TIME_IN_MILLIS.HOUR) {
    formattedDate = dayjs(dateDiff).format(DATE_FORMATS.LESS_THAN_HOUR);
    return `${formattedDate}M`;
  }

  if (dateDiff <= TIME_IN_MILLIS.DAY) {
    formattedDate = dayjs(dateDiff).format(DATE_FORMATS.LESS_THAN_DAY);
    return addCharsToDate(formattedDate, 'M');
  }

  formattedDate = dayjs(dateDiff).format(DATE_FORMATS.MORE_THAN_DAY);
  return addCharsToDate(formattedDate, 'D', 'H', 'M');
}

// TODO: Переделать на деструктуризацию
function addCharsToDate(date, ...chars) {
  const splittedDate = date.split(' ');
  let index = -1;

  return splittedDate.map((dateNum) => {
    index++;

    if(chars[index]) {
      return `${dateNum}${chars[index]}`;
    }

    return dateNum;
  }).join(' ');
}

export {getRandomArrayElement, getFormattedDateDiff, DATE_FORMATS};
