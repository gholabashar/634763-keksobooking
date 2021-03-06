'use strict';

(function () {
  var Preview = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var template = document.querySelector('#card').content;
  var map = document.querySelector('.map');
  var isShow = false;

  var createPopup = function (host) {
    var item = template.cloneNode(true);
    var featuresElem = item.querySelector('.popup__features');
    var photosElem = item.querySelector('.popup__photos');

    item.querySelector('.popup__title').textContent = host.offer.title;
    item.querySelector('.popup__text--address').textContent = host.offer.address;
    item.querySelector('.popup__text--price').textContent = host.offer.price + '₽/ночь';
    item.querySelector('.popup__type').textContent = window.utils.getHostType(host.offer.type).headerText;
    item.querySelector('.popup__text--capacity').textContent = host.offer.rooms + ' комнаты для ' + host.offer.guests + ' гостей';
    item.querySelector('.popup__text--time').textContent = 'Заезд после ' + host.offer.checkin + ', выезд до ' + host.offer.checkout;
    item.querySelector('.popup__description').textContent = host.offer.description;
    item.querySelector('.popup__avatar').src = host.author.avatar;

    renderFeatures(featuresElem, host.offer.features);
    renderPreviews(photosElem, host.offer.photos, host.offer.title);

    return item;
  };

  var renderFeatures = function (parent, features) {
    parent.textContent = '';
    var fragment = document.createDocumentFragment();

    if (features.length > 0) {
      var items = createFeatures(features);

      items.forEach(function (item) {
        fragment.appendChild(item);
      });
      parent.appendChild(fragment);
    } else {
      parent.style.display = 'none';
    }
  };

  var renderPreviews = function (parent, photos, title) {
    parent.textContent = '';
    var fragment = document.createDocumentFragment();

    if (photos.length > 0) {
      var previews = createPreviews(photos, title);

      previews.forEach(function (preview) {
        fragment.appendChild(preview);
      });
      parent.appendChild(fragment);
    } else {
      parent.style.display = 'none';
    }
  };

  var createFeatures = function (features) {
    return features.map(function (feature) {
      var item = document.createElement('li');

      item.classList.add('popup__feature', 'popup__feature--' + feature);

      return item;
    });
  };

  var createPreviews = function (photos, title) {
    var sorted = window.utils.getSortedList(photos);

    return sorted.map(function (photo) {
      var preview = new Image(Preview.WIDTH, Preview.HEIGHT);

      preview.classList.add('popup__photo');
      preview.src = photo;
      preview.title = title;
      preview.alt = title;

      return preview;
    });
  };

  var open = function (host) {
    if (isShow) {
      hide();
    }

    map.appendChild(createPopup(host));

    var card = document.querySelector('.map__card.popup');
    var close = card.querySelector('.popup__close');

    close.tabIndex = 0;
    close.addEventListener('click', onCloseClick);
    document.addEventListener('keydown', onKeydown);
    isShow = true;
  };

  var hide = function () {
    var card = document.querySelector('.map__card.popup');

    if (card) {
      var close = card.querySelector('.popup__close');
      close.removeEventListener('click', onCloseClick);
      document.removeEventListener('keydown', onKeydown);
      card.remove();
    }
    isShow = false;
  };

  var onCloseClick = function () {
    hide();
  };

  var onKeydown = function (evt) {
    window.utils.escKeyCheck(evt.keyCode, hide);
  };

  window.card = {
    hide: hide,
    open: open
  };
})();
