'use strict';

(function () {
  var pin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

  var mapFilter = map.querySelector('.map__filters');
  var filters = mapFilter.querySelectorAll('select, fieldset');
  var fields = document.querySelectorAll('.ad-form fieldset');
  var MAX_PINS = 5;
  var items = [];

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
    var pins = document.querySelectorAll('.map__pin');

    pins.forEach(function (item) {
      if (item !== pin) {
        item.remove();
      }
    });
  };

  var getItems = function (hosts) {
    items = hosts;
    window.pin.render(items.slice(0, MAX_PINS));
  };

  var setError = function (error) {
    return error;
  };

  var showPins = function () {
    window.backend.load(getItems, setError);
  };

  var setPageActive = function () {
    mapInit();
    showPins();
    window.upload.setActived();

    window.form.init(getPinPosition());
    window.form.toggle(filters, false);
    window.form.toggle(fields, false);

    pin.removeEventListener('mouseup', onPinMouseup);
    pin.removeEventListener('keydown', onPinKeydown);
    mapFilter.addEventListener('change', onFilterChange);
  };

  var setPageDisabled = function () {
    window.form.toggle(filters, true);
    window.form.toggle(fields, true);
    window.upload.setDisabled();
    window.form.setAdress(getPinPosition());
    pin.addEventListener('mousedown', onPinMousedown);
    pin.addEventListener('mouseup', onPinMouseup);
    pin.addEventListener('keydown', onPinKeydown);
    pin.tabIndex = 0;
    mapFilter.removeEventListener('change', onFilterChange);
  };

  var onPinMouseup = function () {
    setPageActive();
    pin.removeEventListener('mouseup', onPinMouseup);
  };

  var onPinKeydown = function (evt) {
    window.utils.enterKeyCheck(evt.keyCode, setPageActive);
  };

  var onFilterChange = window.utils.setDebounce(function () {
    var results = window.filter.getFiltered(items);

    window.card.hide();
    removePins();

    window.pin.render(results.slice(0, MAX_PINS));
  });

  setPageDisabled();

  window.map = {
    getPinPosition: getPinPosition,
    hideMap: hideMap,
    removePins: removePins,
    setPageDisabled: setPageDisabled,
    resetPinPosition: resetPinPosition
  };
})();
