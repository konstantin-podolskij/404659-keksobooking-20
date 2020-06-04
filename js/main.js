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
var ARRAY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ARRAY_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var OFFER_TITLE = 'Заголовок предложения №';
var OFFER_DESCRIPTION = 'Описание предложения №';

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');

var getRandomNumber = function (min, max) {
  var rand = min + Math.random() * (max - min);
  return Math.floor(rand);
};

var getRandomValue = function (array, min, max) {
  if (array) {
    return array[getRandomNumber(0, array.length)];
  } else {
    return getRandomNumber(min, max);
  }
};

var getInfo = function (firstPart, secondPart, isCoord) {
  if (isCoord) {
    return firstPart + ', ' + secondPart;
  }
  return firstPart + secondPart;
};

var getRandomArray = function (newArray, array) {
  for (var i = 0; i < getRandomNumber(1, array.length); i++) {
    newArray.push(getRandomValue(array));
  }
  return newArray;
};

var createOffer = function (value) {
  var avatarUrl = 'img/avatars/user0' + value + '.png';
  var coordX = getRandomValue(false, MIN_COORD_X_LOCATION, MAX_COORD_X_LOCATION);
  var coordY = getRandomValue(false, MIN_COORD_Y_LOCATION, MAX_COORD_Y_LOCATION);
  var arrPhotos = [];
  var arrFeatures = [];
  var currentOffer = {
    author: {
      avatar: avatarUrl
    },
    offer: {
      title: getInfo(OFFER_TITLE, value),
      address: getInfo(coordX, coordY, true),
      price: getRandomValue(false, MIN_PRICE, MAX_PRICE),
      type: getRandomValue(HOUSING_TYPES),
      rooms: getRandomValue(false, MIN_ROOM, MAX_ROOM),
      guests: getRandomValue(false, MIN_GUEST, MAX_GUEST),
      checkin: getRandomValue(TIMEIN_HOURS),
      checkout: getRandomValue(TIMEOUT_HOURS),
      features: getRandomArray(arrPhotos, ARRAY_FEATURES),
      description: getInfo(OFFER_DESCRIPTION, value),
      photos: getRandomArray(arrFeatures, ARRAY_PHOTOS)
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

var renderPinList = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createPin(array[i]));
  }
  mapPins.appendChild(fragment);
};


map.classList.remove('map--faded');

renderPinList(fillArrayOffer());
