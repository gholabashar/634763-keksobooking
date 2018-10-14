'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };
  var Pin = {
    ARROWHEIGHT: 22,
    GAP_X: 25,
    GAP_Y: 35
  };

  var Position = {
    MIN_Y: 130,
    MAX_Y: 630,
    MIN_X: 0,
    MAX_X: 1200
  };

  var HostType = {
    'bungalo': {
      headerText: 'Бунгало',
      minCost: 0
    },
    'flat': {
      headerText: 'Квартира',
      minCost: 1000
    },
    'house': {
      headerText: 'Дом',
      minCost: 5000
    },
    'palace': {
      headerText: 'Дворец',
      minCost: 10000
    }
  };

  var StatusCode = {
    SUCCESS: 200,
    ERROR_REQUEST: 400,
    ERROR_NOT_FOUND: 404,
    ERROR_SERVER: 500
  };

  var getRandomNumber = function (min, max) {
    return Math.floor((Math.random() * (max - min) + min));
  };

  var getRandomItem = function (array) {
    return array[getRandomNumber(0, array.length)];
  };

  var sortElements = function () {
    return 0.5 - Math.random();
  };

  var getSortedList = function (list) {
    list.sort(sortElements);
    return list;
  };

  var getHostType = function (type) {
    return HostType[type];
  };

  var escKeyCheck = function (keyCode, callback) {
    if (keyCode === KeyCode.ESC) {
      callback();
    }
  };

  var enterKeyCheck = function (keyCode, callback) {
    if (keyCode === KeyCode.ENTER) {
      callback();
    }
  };

  var statusCodeCB = function (xhr, successCallback, errorCallback) {
    switch (xhr.status) {
      case StatusCode.SUCCESS:
        successCallback(xhr.response);
        break;
      case StatusCode.ERROR_REQUEST:
        errorCallback('Ошибка запроса');
        break;
      case StatusCode.ERROR_NOT_FOUND:
        errorCallback('Не найдено');
        break;
      case StatusCode.ERROR_SERVER:
        errorCallback('Внутренняя ошибка сервера');
        break;
      default:
        errorCallback('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    }
  };

  var setDebounce = function (fun) {
    var lastTimeout = null;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun();
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
    enterKeyCheck: enterKeyCheck,
    getRandomItem: getRandomItem,
    getSortedList: getSortedList,
    getHostType: getHostType,
    escKeyCheck: escKeyCheck,
    Position: Position,
    KeyCode: KeyCode,
    Pin: Pin,
    statusCodeCB: statusCodeCB,
    setDebounce: setDebounce
  };
})();
