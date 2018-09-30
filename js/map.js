'use strict';

(function () {
  var pin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

  var getPinPosition = function () {
    var pinX = parseInt(pin.style.left, 10) - window.utils.Pin.GAP_X;
    var pinY = parseInt(pin.style.top, 10) - window.utils.Pin.GAP_Y;

    return [pinX, pinY].join(', ');
  };

  var pinMousedownHandler = function (evt) {
    var startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinMousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var currentPoints = {
        x: startPoints.x - moveEvt.clientX,
        y: startPoints.y - moveEvt.clientY
      };

      var currentY = pin.offsetTop - currentPoints.y;
      var stopY = currentY + window.utils.Pin.GAP_Y;
      var currentX = pin.offsetLeft - currentPoints.x;
      var stopLeftX = window.utils.Pin.GAP_X;
      var stopRightX = document.body.offsetWidth
        - window.utils.Pin.WIDTH_BIG / 2;

      startPoints = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (stopY > window.utils.Position.MIN + window.utils.Pin.MAIN_GAP
        && stopY < window.utils.Position.MAX) {
        pin.style.top = currentY + 'px';
      }

      if (stopRightX > currentX && stopLeftX < currentX) {
        pin.style.left = currentX + 'px';
      }
    };

    var pinMouseupHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', pinMousemoveHandler);
      document.removeEventListener('mouseup', pinMouseupHandler);
      window.form.setAdress(getPinPosition());
    };

    document.addEventListener('mousemove', pinMousemoveHandler);
    document.addEventListener('mouseup', pinMouseupHandler);
  };

  var mapInit = function () {
    map.classList.remove('map--faded');
  };

  var setPageActive = function () {
    mapInit();
    window.form.init(getPinPosition());
    window.form.toggle(false);
    window.pin.render(window.data.getData);

    pin.removeEventListener('mouseup', pinMouseupHandler);
    pin.removeEventListener('keydown', pinKeydownHandler);
  };

  var setPageDisabled = function () {
    window.form.toggle(true);
    window.form.setAdress(getPinPosition());
    pin.addEventListener('mousedown', pinMousedownHandler);
    pin.addEventListener('mouseup', pinMouseupHandler);
    pin.addEventListener('keydown', pinKeydownHandler);
    pin.tabIndex = 0;
  };

  var pinMouseupHandler = function () {
    setPageActive();
    pin.removeEventListener('mouseup', pinMouseupHandler);
  };

  var pinKeydownHandler = function (evt) {
    window.utils.enterKeyCheck(evt.keyCode, setPageActive);
  };

  setPageDisabled();

  window.main = {
    getPinPosition: getPinPosition
  };
})();
