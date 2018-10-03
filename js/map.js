'use strict';

(function () {
  var pin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

  var pinLeftStart = parseInt(pin.style.left, 10);
  var pinTopStart = parseInt(pin.style.top, 10);

  var getPinPosition = function () {
    var pinX = parseInt(pin.style.left, 10) - window.utils.Pin.GAP_X;
    var pinY = parseInt(pin.style.top, 10) - window.utils.Pin.GAP_Y;

    return [pinX, pinY].join(', ');
  };

  var resetPinPosition = function () {
    pin.style.left = pinLeftStart + 'px';
    pin.style.top = pinTopStart + 'px';
  };

  var onPinMousedown = function (evt) {
    var startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onPinMousemove = function (moveEvt) {
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

    var onPinMouseup = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onPinMousemove);
      document.removeEventListener('mouseup', onPinMouseup);
      window.form.setAdress(getPinPosition());
    };

    document.addEventListener('mousemove', onPinMousemove);
    document.addEventListener('mouseup', onPinMouseup);
  };

  var mapInit = function () {
    map.classList.remove('map--faded');
  };

  var hideMap = function () {
    if (!map.classList.contains('map--faded')) {
      map.classList.add('map--faded');
    }
  };

  var removePins = function () {
    var items = document.querySelectorAll('.map__pin');

    items.forEach(function (item) {
      if (item !== pin) {
        item.remove();
      }
    });
  };

  var setPageActive = function () {
    mapInit();
    window.form.init(getPinPosition());
    window.form.toggle(false);
    window.pin.render();

    pin.removeEventListener('mouseup', onPinMouseup);
    pin.removeEventListener('keydown', onPinKeydown);
  };

  var setPageDisabled = function () {
    window.form.toggle(true);
    window.form.setAdress(getPinPosition());
    pin.addEventListener('mousedown', onPinMousedown);
    pin.addEventListener('mouseup', onPinMouseup);
    pin.addEventListener('keydown', onPinKeydown);
    pin.tabIndex = 0;
  };

  var onPinMouseup = function () {
    setPageActive();
    pin.removeEventListener('mouseup', onPinMouseup);
  };

  var onPinKeydown = function (evt) {
    window.utils.enterKeyCheck(evt.keyCode, setPageActive);
  };

  setPageDisabled();

  window.map = {
    getPinPosition: getPinPosition,
    hideMap: hideMap,
    removePins: removePins,
    setPageDisabled: setPageDisabled,
    resetPinPosition: resetPinPosition
  };
})();
