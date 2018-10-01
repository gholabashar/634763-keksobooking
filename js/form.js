'use strict';

(function () {
  var RESET_TIMEOUT = 300;
  var Title = {
    MIN: 30,
    MAX: 100
  };
  var Rooms = {
    MIN: 1,
    MAX: 3
  };
  var ValidityMessage = {
    TITLE: 'Введите от 30 до 100 символов.',
    PRICE: 'Укажите стоимость проживания',
    PRICE_MIN: 'Слишком низкая цена',
    PRICE_MAX: 'Цена превышает допустимую',
    IS_EMPTY: 'Краткое описание объявления',
    REMOVE: ''
  };
  var size = {
    '1': ['для 1 гостя'],
    '2': ['для 1 гостя', 'для 2 гостей'],
    '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
    '100': ['не для гостей']
  };

  var form = document.querySelector('.ad-form');
  var address = form.querySelector('#address');
  var title = form.querySelector('#title');
  var price = form.querySelector('#price');
  var type = form.querySelector('#type');
  var room = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');
  var reset = form.querySelector('.ad-form__reset');
  var fields = form.querySelectorAll('fieldset');
  var times = form.querySelectorAll('.ad-form__element--time select');

  var setAdress = function (position) {
    address.value = position;
  };

  var setPrice = function () {
    var cost = window.utils.getHostTypes(type.value).minCost;
    price.min = cost;
    price.placeholder = cost;
  };

  var toggle = function (isDisabled) {
    fields.forEach(function (field) {
      field.disabled = isDisabled;
    });
  };

  var typeChangeHandler = function () {
    setPrice();
  };

  var timeChangeHandler = function (evt) {
    times.forEach(function (time) {
      if (evt.target.value !== time.value) {
        time.value = evt.target.value;
      }
    });
  };

  var titleInvalidHandler = function (evt) {
    if (title.validity.tooShort || title.validity.tooLong) {
      title.setCustomValidity(ValidityMessage.TITLE +
        ' Введено: ' + evt.target.value.length);
    } else if (title.validity.valueMissing) {
      title.setCustomValidity(ValidityMessage.IS_EMPTY);
    } else {
      title.setCustomValidity(ValidityMessage.REMOVE);
    }
  };

  var priceInvalidHandler = function (evt) {
    if (price.validity.valueMissing) {
      price.setCustomValidity(ValidityMessage.PRICE);
    } else if (price.validity.rangeUnderflow) {
      price.setCustomValidity(ValidityMessage.PRICE_MIN);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity(ValidityMessage.PRICE_MAX);
    } else {
      price.setCustomValidity(ValidityMessage.REMOVE);
    }
  };

  var renderPlaces = function (isReset) {
    var space = room.value;
    var area = isReset ? Rooms.MIN : space;
    var places = size[area];
    capacity.textContent = '';

    places.forEach(function (place, i) {
      var option = document.createElement('option');
      option.textContent = place;
      option.value = (parseInt(space) > Rooms.MAX) ? 0 : i + 1;
      capacity.appendChild(option);
    });
  };

  var update = function () {
    renderPlaces(false);
  };

  var updateValues = function () {
    setPrice();
    setAdress(window.map.getPinPosition());
  };

  var resetClickHandler = function () {
    renderPlaces(true);
    setTimeout(updateValues, RESET_TIMEOUT);
  };

  reset.addEventListener('click', resetClickHandler);

  var roomChangeHandler = function () {
    update();
  };

  var addHandlers = function () {
    times.forEach(function (select) {
      select.addEventListener('change', timeChangeHandler);
    });

    room.addEventListener('change', roomChangeHandler);
    type.addEventListener('change', typeChangeHandler);
    title.addEventListener('invalid', titleInvalidHandler);
    price.addEventListener('invalid', priceInvalidHandler);
    reset.addEventListener('click', resetClickHandler);
    form.addEventListener('submit', formSubmitHandler);
  };

  var removeHandlers = function () {
    times.forEach(function (select) {
      select.removeEventListener('change', timeChangeHandler);
    });

    room.removeEventListener('change', roomChangeHandler);
    type.removeEventListener('change', typeChangeHandler);
    title.removeEventListener('invalid', titleInvalidHandler);
    price.removeEventListener('invalid', priceInvalidHandler);
    reset.removeEventListener('click', resetClickHandler);
    form.removeEventListener('submit', formSubmitHandler);
  };

  var init = function (position) {
    setAdress(position);
    setPrice();
    update();

    addHandlers();

    form.classList.remove('ad-form--disabled');
  };

  var keydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideMessage);
  };

  var clickHandler = function () {
    hideMessage();
  };

  var hideMessage = function () {
    var dialog = document.querySelector('.success');

    dialog.remove();
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
  };

  var showMessage = function () {
    var template = document.querySelector('#success')
      .content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('click', clickHandler);
  };

  var setSuccess = function () {
    form.reset();
    form.classList.add('ad-form--disabled');
    updateValues();

    removeHandlers();

    window.map.hideMap();
    window.map.setPageDisabled();
    window.map.resetPinPosition();
    window.map.removePins();
    window.card.hide();

    showMessage();
  };

  var errorKeydownHandler = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideError);
  };

  var errorClickHandler = function () {
    hideError();
  };

  var showError = function () {
    var template = document.querySelector('#error')
      .content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', errorKeydownHandler);
    document.addEventListener('click', errorClickHandler);
  };

  var hideError = function () {
    var dialog = document.querySelector('.error');

    dialog.remove();

    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('click', clickHandler);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.send(new FormData(form), setSuccess, showError);
  };

  window.form = {
    setAdress: setAdress,
    toggle: toggle,
    init: init
  };
  
})();
