'use strict';

(function () {
  var MAX_PINS = 5;
  var items = [];

  var pin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

  var mapFilter = map.querySelector('.map__filters');
  var filters = mapFilter.querySelectorAll('select, fieldset');
  var fields = document.querySelectorAll('.ad-form fieldset');

  var pinLeftStart = parseInt(pin.style.left, 10);
  var pinTopStart = parseInt(pin.style.top, 10);

  var getPinPosition = function () {
    var pinX = Math.round(parseInt(pin.style.left, 10) + pin.offsetWidth / 2);
    var pinY = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight + window.utils.Pin.ARROWHEIGHT);

    return [pinX, pinY].join(', ');
  };

  var resetPinPosition = function () {
    pin.style.left = pinLeftStart + 'px';
    pin.style.top = pinTopStart + 'px';
  };

  var onPinMouseDown = function (evt) {
    var startPoints = {
      x: evt.clientX,
      y: evt.clientY
    };
    var dragged = false;

    var onPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var currentPoints = {
        x: startPoints.x - moveEvt.clientX,
        y: startPoints.y - moveEvt.clientY
      };

      var currentY = pin.offsetTop - currentPoints.y;
      var currentX = pin.offsetLeft - currentPoints.x;
      var pinWidth = pin.offsetWidth;
      var halfPinWidth = Math.round(pinWidth / 2);

      startPoints = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (currentX <= window.utils.Position.MIN_X - halfPinWidth) {
        pin.style.left = window.utils.Position.MIN_X - halfPinWidth + 'px';
      } else if (currentX >= window.utils.Position.MAX_X - halfPinWidth) {
        pin.style.left = window.utils.Position.MAX_X - halfPinWidth + 'px';
      } else {
        pin.style.left = currentX + 'px';
      }

      if (currentY <= window.utils.Position.MIN_Y - pinWidth - window.utils.Pin.ARROWHEIGHT) {
        pin.style.top = window.utils.Position.MIN_Y - pinWidth - window.utils.Pin.ARROWHEIGHT + 'px';
      } else if (currentY >= window.utils.Position.MAX_Y - pinWidth - window.utils.Pin.ARROWHEIGHT) {
        pin.style.top = window.utils.Position.MAX_Y - pinWidth - window.utils.Pin.ARROWHEIGHT + 'px';
      } else {
        pin.style.top = currentY + 'px';
      }

      window.form.setAdress(getPinPosition());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (evtDragged) {
          evtDragged.preventDefault();
          pin.removeEventListener('click', onClickPreventDefault);
        };
        pin.addEventListener('click', onClickPreventDefault);
      }

      setPageActive();
    };

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var mapInit = function () {
    map.classList.remove('map--faded');
  };

  var hide = function () {
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
    pin.addEventListener('mousedown', onPinMouseDown);
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
    hide: hide,
    removePins: removePins,
    setPageDisabled: setPageDisabled,
    resetPinPosition: resetPinPosition
  };
})();
