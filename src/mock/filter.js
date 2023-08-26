const filters = [
  {
    name: 'Everything',
    checked: true,
    dataLength: 15, // Количество точек маршрута, доступных по данному фильтру
  },

  {
    name: 'Past',
    checked: false,
    dataLength: 0,
  },

  {
    name: 'Present',
    checked: false,
    dataLength: 5,
  },

  {
    name: 'Future',
    checked: false,
    dataLength: 10,
  },
];

function getFilters() {
  return filters;
}

export { getFilters };
