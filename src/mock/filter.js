const filters = [
  {
    name: 'Everything',
    checked: true,
    disabled: false,
  },

  {
    name: 'Future',
    checked: false,
    disabled: false,
  },

  {
    name: 'Present',
    checked: false,
    disabled: false,
  },

  {
    name: 'Past',
    checked: false,
    disabled: true,
  },
];

function getFilters() {
  return filters;
}

export { getFilters };
