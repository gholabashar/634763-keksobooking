'use strict';

var LOCATION_X = {
  min: 250,
  max: 1000
}
var LOCATION_Y = {
  min: 130,
  max: 630
}
var PRICE = {
  min: 1000,
  max: 1000000
}
var ROOMS = {
  min: 1,
  max: 5
}
var GUESTS = {
  min: 2 * ROOMS.min,
  max: 2 * ROOMS.max
}
var KEYCODE = {
  enter: 13,
  esc: 27
};

var TYPES = {
  'bungalo': {
    headerText: 'Бунгало',
    minCost: 0,
  },
  'flat': {
    headerText: 'Квартира',
    minCost: 1000,
  },
  'house': {
    headerText: 'Дом',
    minCost: 5000,
  },
  'palace': {
    headerText: 'Дворец',
    minCost: 10000,
  }
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

var TITLE_LIMIT = {
  min: 30,
  max: 100
};
var MESSAGES = {
  title: 'Введите от 30 до 100 символов.',
  price: 'Укажите желаемую стоимость номера',
};

var capRooms = {
  '1': ['для 1 гостя'],
  '2': ['для 1 гостя', 'для 2 гостей'],
  '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
  '100': ['не для гостей']
};

(function () {
  var promotionsList = [];

  var similarPinsElement = document.querySelector('.map__pins');
  var similarPinsTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var similarCardElement = document.querySelector('.map');
  var similarCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var form = document.querySelector('.ad-form');
  var addFormElements = document.querySelectorAll('fieldset, select');
  var mapPinMain = document.querySelector('.map__pin--main');

  var inputTitle = form.querySelector('#title');
  var inputPrice = form.querySelector('#price');
  var inputAddress = form.querySelector('#address');
  var inputType = form.querySelector('#type');
  var inputTime = form.querySelectorAll('.ad-form__element--time select');
  var inputRooms = form.querySelector('#room_number');
  var roomPlaces = form.querySelector('#capacity');

  var cardElement = similarCardTemplate.cloneNode(true);

  inputAddress.value = parseInt(mapPinMain.style.top, 10) + ', ' + parseInt(mapPinMain.style.left, 10);

  // создание случайных чисел
  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  // случайное свойство из объекта
  var getRandomProperty = function (obj) {
    var randKey = Object.keys(obj);
    return obj[randKey[getRandom(0, randKey.length - 1)]].headerText;
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
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },

        offer: {
          title: TITLES[getRandom(0, TITLES.length - 1)],
          address: getRandom(LOCATION_X.min, LOCATION_X.max) + ', ' + getRandom(LOCATION_Y.min, LOCATION_Y.max),
          price: getRandom(PRICE.min, PRICE.max) + ' ₽/ночь',
          type: getRandomProperty(TYPES),
          rooms: getRandom(ROOMS.min, ROOMS.max),
          guests: getRandom(GUESTS.min, GUESTS.max),
          checkin: TIMES[getRandom(0, TIMES.length - 1)],
          checkout: TIMES[getRandom(0, TIMES.length - 1)],
          features: getRandomElements(FEATURES.sort(sortElements)),
          description: ' ',
          photos: PHOTOS.sort(sortElements)
        },

        location: {
          x: getRandom(LOCATION_X.min, LOCATION_X.max),
          y: getRandom(LOCATION_Y.min, LOCATION_Y.max)
        }
      });

    }
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

  // клик на метку и запись адреса
  mapPinMain.addEventListener('mouseup', function () {
    if (document.querySelector('.map').classList.value === 'map map--faded') {

      document.querySelector('.map').classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
      inputAddress.value = parseInt(mapPinMain.style.top, 10) + ', ' + parseInt(mapPinMain.style.left, 10);

      for (var i = 0; i < addFormElements.length; i++) {
        addFormElements[i].disabled = false;
      }

      inputAddress.disabled = true;
      createPins(promotionsList);
      similarPinsElement.appendChild(fragment);
      initForm();
    } else {
      inputAddress.value = parseInt(mapPinMain.style.top, 10) + ', ' + parseInt(mapPinMain.style.left, 10);
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
    } else if (evt.target.tagName === 'IMG' && parentEl.dataset.adsId !== 'undefined' && parentEl.className !== 'map__pin map__pin--main') {
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
    if (evt.keyCode === KEYCODE.esc) {
      cardElement.classList.add('hidden');
    }
  });

  // установка цены
  var setMinPrice = function () {
    var minCost = TYPES[inputType.value].minCost;

    inputPrice.min = minCost;
    inputPrice.placeholder = minCost;
  };

  /**
   * Handler for update host check time field
   * @param {Object} evt - change select event
   */
  var changeTime = function (evt) {
    inputTime.forEach(function (item) {
      if (evt.target.value !== item.value) {
        item.value = evt.target.value;
      }
    });
  };

  /**
   * Listener for check when title has not valid length
   * @param {Object} evt - input text event
   */
  var inputTitleInvalidListener = function (evt) {
    if (evt.target.value.length <= TITLE_LIMIT.min
      || evt.target.value.length >= TITLE_LIMIT.max) {
      inputTitle.setCustomValidity(MESSAGES.title);
    } else {
      inputTitle.setCustomValidity('');
    }
  };

  /**
   * Listener for check when price not filled
   * @param {Object} evt - input text event
   */
  var inputPriceInvalidListener = function (evt) {
    if (!evt.target.value) {
      inputPrice.setCustomValidity(MESSAGES.price);
    } else {
      inputPrice.setCustomValidity('');
    }
  };

  /**
   * Check current rooms count and render options
   */
  var roomsUpdate = function () {
    var room = inputRooms.value;
    var placesForRoom = capRooms[room];
    roomPlaces.textContent = '';

    placesForRoom.forEach(function (item, i) {
      var forPlacesOption = document.createElement('option');
      forPlacesOption.textContent = item;
      forPlacesOption.value = (+room > 3) ? 0 : i + 1;
      roomPlaces.appendChild(forPlacesOption);
    });
  };

  /**
   * Init event listeners when page becomes active
   */
  var initForm = function () {
    inputTime.forEach(function (select) {
      select.addEventListener('change', changeTime);
    });
    inputRooms.addEventListener('change', roomsUpdate);
    inputType.addEventListener('change', setMinPrice);
    inputTitle.addEventListener('invalid', inputTitleInvalidListener);
    inputPrice.addEventListener('invalid', inputPriceInvalidListener);
    setMinPrice();
    roomsUpdate();
  };

}());
