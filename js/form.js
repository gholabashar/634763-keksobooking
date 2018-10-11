'use strict';

(function () {
  var RESET_TIMEOUT = 300;

  var Rooms = {
    MIN: 1,
    MAX: 3
  };
  var ValidityMessage = {
    TITLE: 'Введите от 30 до 100 символов.',
    PRICE: 'Укажите стоимость проживания',
    PRICE_MIN: 'Слишком низкая цена',
    PRICE_MAX: 'Цена превышает допустимую',
    IS_EMPTY: 'Укажите описание объявления',
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
  var times = form.querySelectorAll('.ad-form__element--time select');

  var setAdress = function (position) {
    address.value = position;
  };

  var setPrice = function () {
    var cost = window.utils.getHostType(type.value).minCost;
    price.min = cost;
    price.placeholder = cost;
  };

  var toggle = function (fields, isDisabled) {
    fields.forEach(function (field) {
      field.disabled = isDisabled;
    });
  };

  var onTypeChange = function () {
    setPrice();
  };

  var onTimeChange = function (evt) {
    times.forEach(function (time) {
      if (evt.target.value !== time.value) {
        time.value = evt.target.value;
      }
    });
  };

  var onTitleInvalid = function (evt) {
    if (title.validity.tooShort || title.validity.tooLong) {
      title.setCustomValidity(ValidityMessage.TITLE +
        ' Введено: ' + evt.target.value.length);
    } else if (title.validity.valueMissing) {
      title.setCustomValidity(ValidityMessage.IS_EMPTY);
    } else {
      title.setCustomValidity(ValidityMessage.REMOVE);
    }
  };

  var onPriceInvalid = function () {
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
      option.value = (parseInt(space, 10) > Rooms.MAX) ? 0 : i + 1;
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

  var resetAllData = function () {
    form.reset();
    form.classList.add('ad-form--disabled');
    removeHandlers();
    window.map.hide();
    window.map.setPageDisabled();
    window.map.resetPinPosition();
    window.map.removePins();
    window.card.hide();
  };

  var onResetClick = function () {
    resetAllData();
    // renderPlaces(true);
    setTimeout(updateValues, RESET_TIMEOUT);
  };

  reset.addEventListener('click', onResetClick);

  var onRoomChange = function () {
    update();
  };

  var addHandlers = function () {
    times.forEach(function (select) {
      select.addEventListener('change', onTimeChange);
    });

    room.addEventListener('change', onRoomChange);
    type.addEventListener('change', onTypeChange);
    title.addEventListener('invalid', onTitleInvalid);
    price.addEventListener('invalid', onPriceInvalid);
    reset.addEventListener('click', onResetClick);
    form.addEventListener('submit', onFormSubmit);
  };

  var removeHandlers = function () {
    times.forEach(function (select) {
      select.removeEventListener('change', onTimeChange);
    });
    room.removeEventListener('change', onRoomChange);
    type.removeEventListener('change', onTypeChange);
    title.removeEventListener('invalid', onTitleInvalid);
    price.removeEventListener('invalid', onPriceInvalid);
    reset.removeEventListener('click', onResetClick);
    form.removeEventListener('submit', onFormSubmit);
  };

  var init = function (position) {
    setAdress(position);
    setPrice();
    update();
    address.setAttribute('disabled', 'disabled');
    addHandlers();

    form.classList.remove('ad-form--disabled');
  };

  var onKeydown = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideMessage);
  };

  var onClick = function () {
    hideMessage();
  };

  var hideMessage = function () {
    var dialog = document.querySelector('.success');

    dialog.remove();
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onClick);
  };

  var showMessage = function () {
    var template = document.querySelector('#success').content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onClick);
  };

  var setSuccess = function () {
    form.reset();
    setTimeout(updateValues, RESET_TIMEOUT);
    resetAllData();
    showMessage();
  };

  var onErrorKeydown = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hideError);
  };

  var onErrorClick = function () {
    hideError();
  };

  var showError = function () {
    var template = document.querySelector('#error').content.cloneNode(true);
    var main = document.body.querySelector('main');

    main.appendChild(template);

    document.addEventListener('keydown', onErrorKeydown);
    document.addEventListener('click', onErrorClick);
  };

  var hideError = function () {
    var dialog = document.querySelector('.error');

    dialog.remove();

    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onClick);
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.send(new FormData(form), setSuccess, showError);
  };

  window.form = {
    setAdress: setAdress,
    toggle: toggle,
    init: init
  };

})();
