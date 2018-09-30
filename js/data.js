'use strict';

(function () {
  var HEADINGS = [
    'Большая уютная квартира', 'Маленькая неуютная квартира',
    'Огромный прекрасный дворец', 'Маленький ужасный дворец',
    'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking',
    'washer', 'elevator', 'conditioner'];
  var MAX_HOSTS = 8;

  var Price = {
    MIN: 1000,
    MAX: 1000000
  };
  var Room = {
    MIN: 1,
    MAX: 8
  };
  var Guest = {
    MIN: 1,
    MAX: 20
  };
  var Feature = {
    MIN: 1,
    MAX: 6
  };

  var hosts = [];
  var getHosts = function () {

    for (var i = 0; i < MAX_HOSTS; i++) {
      var hostX = window.utils.getRandomNumber(window.utils.Position.MIN,
          window.utils.Position.MAX);
      var hostY = window.utils.getRandomNumber(window.utils.Position.MIN,
          window.utils.Position.MAX);
      var avatarIndex = i + 1;

      hosts.push({
        author: {
          avatar: 'img/avatars/user0' + avatarIndex + '.png'
        },
        offer: {
          title: HEADINGS[i],
          address: [hostX, hostY].join(', '),
          price: window.utils.getRandomNumber(Price.MIN, Price.MAX),
          type: window.utils.getRandomItem(TYPES),
          rooms: window.utils.getRandomNumber(Room.MIN, Room.MAX),
          guests: window.utils.getRandomNumber(Guest.MIN, Guest.MAX),
          checkin: window.utils.getRandomItem(CHECK_TIMES),
          checkout: window.utils.getRandomItem(CHECK_TIMES),
          features: FEATURES.slice(0, window.utils.getRandomNumber(
              Feature.MIN, Feature.MAX)),
          description: '',
          photos: PHOTOS
        },
        location: {
          x: hostX,
          y: hostY
        }
      });
    }
    return hosts;
  };
  hosts = getHosts();

  var getData = hosts;

  var getDataItem = function (index) {
    var getData = hosts;
    return getData[index];
  };

  window.data = {
    getData: getData,
    getDataItem: getDataItem
  };
})();
