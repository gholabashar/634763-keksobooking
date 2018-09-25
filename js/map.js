'use strict';

var LOCATION_X_MIN = 250;
var LOCATION_X_MAX = 1000;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 2 * ROOMS_MIN;
var GUESTS_MAX = 2 * ROOMS_MAX;

var KEY_ESC = 27;
var KEY_ENTER = 13;

var AVATARS_PATH = 'img/avatars/';

var AVATARS = [
  'user01.png',
  'user02.png',
  'user03.png',
  'user04.png',
  'user05.png',
  'user06.png',
  'user07.png',
  'user08.png'
];

var TYPES = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

(function () {
  var promotionsList = [];

  var similarPinsElement = document.querySelector('.map__pins');
  var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var similarCardElement = document.querySelector('.map');
  var similarCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var cardElement = similarCardTemplate.cloneNode(true);

  // создание случайных чисел
  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  // случайное свойство из объекта
  var getRandomProperty = function (obj) {
    var randKey = Object.keys(obj);
    return obj[randKey[getRandom(0,randKey.length-1)]];
  };

  // добавление li в DOM
  var createFeatures = function (array) {
    var featuresFragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var featuresItem = document.createElement('li');
      featuresItem.className = 'popup__feature popup__feature--' + array[i];
      featuresFragment.appendChild(featuresItem);
    }
    return featuresFragment;
  };

  // добавление img в DOM
  var createPhotos = function (array) {
    var photosFragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      var photo = document.createElement('img');
      photo.className = 'popup__photo';
      photo.src = array[i];
      photo.width = '45';
      photo.height = '40';
      photo.alt = 'Фотография жилья';
      photosFragment.appendChild(photo);
    }
    return photosFragment;
  };

  // случайное количество элементов из массива
  var getRandomElements = function (array) {
    return array.slice(0, getRandom(1, array.length));
  };

  // произвольная сортировка элементов масива
  var sortElements = function () {
    return 0.5 - Math.random();
  };

  var fragment = document.createDocumentFragment();

  // создание массива из 8 объявлений
  var getPromotionsList = function () {
    for (var i = 0; i < 8; i++) {

      promotionsList.push({
        author: {
          avatar: AVATARS_PATH + AVATARS[i]
        },

        offer: {
          title: TITLES[getRandom(0, TITLES.length - 1)],
          address: getRandom(LOCATION_X_MIN, LOCATION_X_MAX) + ', ' + getRandom(LOCATION_Y_MIN, LOCATION_Y_MAX),
          price: getRandom(PRICE_MIN, PRICE_MAX) + ' ₽/ночь',
          type: getRandomProperty(TYPES),
          rooms: getRandom(ROOMS_MIN, ROOMS_MAX),
          guests: getRandom(GUESTS_MIN, GUESTS_MAX),
          checkin: TIMES[getRandom(0, TIMES.length - 1)],
          checkout: TIMES[getRandom(0, TIMES.length - 1)],
          features: getRandomElements(FEATURES.sort(sortElements)),
          description: ' ',
          photos: PHOTOS.sort(sortElements)
        },

        location: {
          x: getRandom(LOCATION_X_MIN, LOCATION_X_MAX),
          y: getRandom(LOCATION_Y_MIN, LOCATION_Y_MAX)
        }
      });

    };
    return promotionsList;
  };
  promotionsList = getPromotionsList();

  // создание объявления
  var createPins = function (array) {
    for (var i = 0; i < array.length; i++) {

      var pinsElement = similarPinsTemplate.cloneNode(true);
      pinsElement.style = 'left: ' + array[i].location.x + 'px; top: ' + array[i].location.y + 'px';
      pinsElement.querySelector('img').src = array[i].author.avatar;
      pinsElement.alt = 'Метка объявления';
      pinsElement.dataset.adsId = i;

      fragment.appendChild(pinsElement);
    }
  };

  // создание попапа
  var createCard = function (array, i) {
    var offer = array[i].offer;
    cardElement.querySelector('img').src = array[i].author.avatar;
    cardElement.querySelector('.popup__title').textContent = offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offer.price;
    cardElement.querySelector('.popup__type').textContent = offer.type;
    cardElement.querySelector('.popup__text--capacity').textContent = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'заезд после ' + offer.checkin + ', ' + 'выезд до ' + offer.checkout;
    cardElement.querySelector('.popup__features').textContent = '';
    cardElement.querySelector('.popup__description').textContent = offer.description;
    cardElement.querySelector('.popup__photos').textContent = '';

    similarCardElement.appendChild(cardElement);
    cardElement.querySelector('.popup__features').appendChild(createFeatures(offer.features));
    cardElement.querySelector('.popup__photos').appendChild(createPhotos(offer.photos));
  };

  var form = document.querySelector('.ad-form');
  var addFormElements = document.querySelectorAll('fieldset, select');
  var mapPinMain = document.querySelector('.map__pin--main');
  var formInputAddress = form.querySelector('.ad-form__element:nth-child(3) input');
  formInputAddress.value = parseInt(mapPinMain.style.top, 10) + ', ' + parseInt(mapPinMain.style.left, 10);

  // клик на метку и запись адреса
  mapPinMain.addEventListener('mouseup', function () {
    if (document.querySelector('.map').classList.value === 'map map--faded') {

      document.querySelector('.map').classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
      formInputAddress.value = parseInt(mapPinMain.style.top, 10) + ', ' + parseInt(mapPinMain.style.left, 10);

      for (var i = 0; i < addFormElements.length; i++) {
        addFormElements[i].disabled = false;
      }
      formInputAddress.disabled = true;

      createPins(promotionsList);
      similarPinsElement.appendChild(fragment);
    }
    else {
      formInputAddress.value = parseInt(mapPinMain.style.top, 10) + ', ' + parseInt(mapPinMain.style.left, 10);
    }
  });

  // перетаскивание метки
  mapPinMain.addEventListener('mousedown', function (evt) {
    var startPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvent) {
      var changePosition = {
        x: startPosition.x - moveEvent.clientX,
        y: startPosition.y - moveEvent.clientY,
      };

      startPosition = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };

      mapPinMain.style.top = (mapPinMain.offsetTop - changePosition.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - changePosition.x) + 'px';
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  // клик по объявлениям и показ попапа
  similarPinsElement.addEventListener('click', function (evt) {
    var indexForArray = evt.target.dataset.adsId;
    var parentEl = evt.target.parentElement;
    if (evt.target.tagName === 'BUTTON') {
      createCard(promotionsList, indexForArray);
      cardElement.classList.remove('hidden');
    }
    else if (evt.target.tagName === 'IMG' && parentEl.dataset.adsId !== 'undefined' && parentEl.className !== 'map__pin map__pin--main') {
      indexForArray = parentEl.dataset.adsId;
      createCard(promotionsList, indexForArray);
      cardElement.classList.remove('hidden');
    }

  });

  // закрытие попапа
  cardElement.querySelector('.popup__close').addEventListener('click', function () {
    cardElement.classList.add('hidden');
  });

  similarCardElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_ESC) {
      cardElement.classList.add('hidden');
    }
  });

}());
