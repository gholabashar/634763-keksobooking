'use strict';

(function () {
  var RESET_TIMEOUT = 50;
  var Title = {
    MIN: 30,
    MAX: 100
  };
  var Apartment = {
    MIN: 1,
    MID: 3
  };
  var validityMessage = {
    TITLE: 'Введите от 30 до 100 символов.',
    PRICE: 'Укажите желаемую стоимость номера'
  };
  var sizes = {
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
    if (evt.target.value.length <= Title.MIN
      || evt.target.value.length >= Title.MAX) {
      title.setCustomValidity(validityMessage.TITLE);
    } else {
      title.setCustomValidity('');
    }
  };


  var priceInvalidHandler = function (evt) {
    if (!evt.target.value) {
      price.setCustomValidity(validityMessage.PRICE);
    } else {
      price.setCustomValidity('');
    }
  };


  var renderPlaces = function (isReset) {
    var space = room.value;
    var area = isReset ? Apartment.MIN : space;
    var places = sizes[area];
    capacity.textContent = '';

    places.forEach(function (place, i) {
      var option = document.createElement('option');
      option.textContent = place;
      option.value = (+space > Apartment.MID) ? 0 : i + 1;
      capacity.appendChild(option);
    });
  };


  var update = function () {
    renderPlaces(false);
  };


  var resetClickHandler = function () {
    var updateValues = function () {
      setPrice();
      setAdress(window.main.getPinPosition());
    };

    renderPlaces(true);
    setTimeout(updateValues, RESET_TIMEOUT);
  };

  reset.addEventListener('click', resetClickHandler);


  var roomChangeHandler = function () {
    update();
  };


  var init = function (position) {
    setAdress(position);

    times.forEach(function (select) {
      select.addEventListener('change', timeChangeHandler);
    });

    room.addEventListener('change', roomChangeHandler);
    type.addEventListener('change', typeChangeHandler);
    title.addEventListener('invalid', titleInvalidHandler);
    price.addEventListener('invalid', priceInvalidHandler);

    setPrice();
    update();

    form.classList.remove('ad-form--disabled');
  };

  window.form = {
    setAdress: setAdress,
    toggle: toggle,
    init: init
  };
})();
