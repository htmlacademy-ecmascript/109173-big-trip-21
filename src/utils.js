function getRandomInt(min = 0, max = Infinity) {
  return Math.floor(min + Math.random() * (max - min));
}

function getRandomArrayElement(arr) {
  const randomIndex = getRandomInt(0, arr.length);
  return arr[randomIndex];
}

export {getRandomArrayElement};
