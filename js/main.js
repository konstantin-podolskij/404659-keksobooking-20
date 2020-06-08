'use strict';

var MIN_COORD_Y_LOCATION = 130;
var MAX_COORD_Y_LOCATION = 630;
var MIN_COORD_X_LOCATION = 0;
var MAX_COORD_X_LOCATION = 1200;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_PRICE = 0;
var MAX_PRICE = 10000;
var MIN_GUEST = 1;
var MAX_GUEST = 8;
var MIN_ROOM = 1;
var MAX_ROOM = 4;
var MAX_COUNT_OFFERS = 8;
var HOUSING_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMEIN_HOURS = ['12:00', '13:00', '14:00'];
var TIMEOUT_HOURS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var OFFER_TITLE = 'Заголовок предложения №';
var OFFER_DESCRIPTION = 'Описание предложения №';
var ROOM_DECLENSIONS = ['комната', 'комнаты', 'комнат'];
var GUEST_DECLENSIONS = ['гостя', 'гостей', 'гостей'];

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFilters = map.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card');

var getRandomNumber = function (min, max) {
  var rand = min + Math.random() * (max - min);
  return Math.floor(rand);
};

var getRandomValue = function (array) {
  return array[getRandomNumber(0, array.length)];
};

var getInfo = function (firstPart, secondPart, isCoord) {
  if (isCoord) {
    return firstPart + ', ' + secondPart;
  }
  return firstPart + secondPart;
};

var getRandomArray = function (array) {
  var newArray = [];
  for (var i = 0; i < getRandomNumber(1, array.length); i++) {
    newArray.push(getRandomValue(array));
  }
  return newArray;
};

var numToString = function (count, array) {
  var num = Math.abs(num) % 100;
  var remainder = num % 10;
  if (num > 10 && num < 20) {
    return array[2];
  }
  if (remainder > 1 && remainder < 5) {
    return array[1];
  }
  if (remainder === 1) {
    return array[0];
  }

  return array[2];
};

var createOffer = function (value) {
  var avatarUrl = 'img/avatars/user0' + value + '.png';
  var coordX = getRandomNumber(MIN_COORD_X_LOCATION, MAX_COORD_X_LOCATION);
  var coordY = getRandomNumber(MIN_COORD_Y_LOCATION, MAX_COORD_Y_LOCATION);
  var currentOffer = {
    author: {
      avatar: avatarUrl
    },
    offer: {
      title: getInfo(OFFER_TITLE, value),
      address: getInfo(coordX, coordY, true),
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: getRandomValue(HOUSING_TYPES),
      rooms: getRandomNumber(MIN_ROOM, MAX_ROOM),
      guests: getRandomNumber(MIN_GUEST, MAX_GUEST),
      checkin: getRandomValue(TIMEIN_HOURS),
      checkout: getRandomValue(TIMEOUT_HOURS),
      features: getRandomArray(OFFER_FEATURES),
      description: getInfo(OFFER_DESCRIPTION, value),
      photos: getRandomArray(OFFER_PHOTOS)
    },
    location: {
      x: coordX,
      y: coordY
    }
  };
  return currentOffer;
};

var fillArrayOffer = function () {
  var offers = [];
  for (var i = 1; i <= MAX_COUNT_OFFERS; i++) {
    var offer = createOffer(i);
    offers.push(offer);
  }
  return offers;
};

var createPin = function (obj) {
  var pinElem = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);
  var pinImg = pinElem.querySelector('img');
  var moveX = PIN_WIDTH / 2;
  var moveY = PIN_HEIGHT;

  pinElem.style.left = (obj.location.x - moveX) + 'px';
  pinElem.style.top = (obj.location.y - moveY) + 'px';
  pinImg.src = obj.author.avatar;
  pinImg.alt = obj.offer.title;

  return pinElem;
};

var getHousingType = function (housingType) {
  var typeName = 'Неизвестно';
  switch (housingType) {
    case 'flat':
      typeName = 'Квартира';
      break;
    case 'palace':
      typeName = 'Дворец';
      break;
    case 'house':
      typeName = 'Дом';
      break;
    case 'bungalo':
      typeName = 'Бунгало';
      break;
    default:
      break;
  }

  return typeName;
};

var getfeatureName = function (type) {
  var featuresName = 'Неизвестно';
  switch (type) {
    case 'wifi':
      featuresName = 'WI-FI';
      break;
    case 'dishwasher':
      featuresName = 'Посудомоечная машина';
      break;
    case 'washer':
      featuresName = 'Стиральная машина';
      break;
    case 'parking':
      featuresName = 'Паркинг';
      break;
    case 'elevator':
      featuresName = 'Лифт';
      break;
    case 'conditioner':
      featuresName = 'Кондиционер';
      break;
    default:
      break;
  }

  return featuresName;
};

var getFeaturesInfo = function (array) {
  var arrFeaturesName = [];
  array.forEach(function (elem) {
    arrFeaturesName.push(getfeatureName(elem));
  });

  return arrFeaturesName.join(', ');
};

var getCapacityInfo = function (roomsCount, guestsCount) {
  return roomsCount + ' ' + numToString(roomsCount, ROOM_DECLENSIONS) + ' для ' + guestsCount + ' ' + numToString(guestsCount, GUEST_DECLENSIONS);
};

var getTimeInfo = function (checkin, checkout) {
  return 'Заезд после ' + checkin + ', выезд до ' + checkout;
};

var renderPinList = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createPin(array[i]));
  }
  mapPins.appendChild(fragment);
  renderCard(array[0]);
};

var addPhotos = function (cardItem, array) {
  var imageBlock = cardItem.querySelector('.popup__photos');
  imageBlock.removeChild(imageBlock.firstElementChild);

  for (var i = 0; i < array.length; i++) {
    var image = document.createElement('img');
    image.src = array[i];
    imageBlock.appendChild(image);
  }
};

var renderCard = function (elem) {
  var cardElement = cardTemplate.cloneNode(true);
  var cardItem = cardElement.content.querySelector('.map__card');

  cardItem.querySelector('.popup__title').textContent = elem.offer.title;
  cardItem.querySelector('.popup__type').textContent = getHousingType(elem.offer.type);
  cardItem.querySelector('.popup__text--address').textContent = elem.offer.address;
  cardItem.querySelector('.popup__text--price').textContent = elem.offer.price + '₽/ночь';
  cardItem.querySelector('.popup__text--capacity').textContent = getCapacityInfo(elem.offer.rooms, elem.offer.guests);
  cardItem.querySelector('.popup__text--time').textContent = getTimeInfo(elem.offer.checkin, elem.offer.checkout);
  cardItem.querySelector('.popup__features').textContent = getFeaturesInfo(elem.offer.features);
  cardItem.querySelector('.popup__description').textContent = elem.offer.description;
  cardItem.querySelector('.popup__avatar').src = elem.author.avatar;

  addPhotos(cardItem, elem.offer.photos);

  map.insertBefore(cardElement, mapFilters);
};


map.classList.remove('map--faded');

renderPinList(fillArrayOffer());
