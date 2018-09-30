'use strict';

(function () {
  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };
  var Pin = {
    WIDTH: 50,
    WIDTH_BIG: 200,
    GAP_X: 25,
    HEIGHT: 70,
    GAP_Y: 35,
    MAIN_GAP: 30,
    GAP_BIG_X: 70
  };
  var Position = {
    MIN: 130,
    MAX: 630
  };

  var hostTypes = {
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


  var getRandomNumber = function (minNumber, maxNumber) {
    return Math.floor((Math.random() * (maxNumber - minNumber) + minNumber));
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


  var getHostTypes = function (type) {
    return hostTypes[type];
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

  window.utils = {
    getRandomNumber: getRandomNumber,
    enterKeyCheck: enterKeyCheck,
    getRandomItem: getRandomItem,
    getSortedList: getSortedList,
    getHostTypes: getHostTypes,
    escKeyCheck: escKeyCheck,
    Position: Position,
    KeyCode: KeyCode,
    Pin: Pin
  };
})();
