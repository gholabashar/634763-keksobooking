'use strict';

(function () {
  var template = document.querySelector('#pin').content;
  var list = document.querySelector('.map__pins');


  var create = function (host) {
    var pin = template.cloneNode(true);
    var item = pin.querySelector('.map__pin');
    var pic = pin.querySelector('img');

    item.style.left = host.location.x - window.utils.Pin.GAP_X + 'px';
    item.style.top = host.location.y - window.utils.Pin.GAP_Y + 'px';
    pic.src = host.author.avatar;
    pic.title = host.offer.title;
    pic.alt = host.offer.title;

    return item;
  };


  var pinClickHandler = function (evt, i) {
    var selected = document.querySelector('.map__pin--active');
    var host = window.data.getDataItem(i);

    window.card.open(host);

    if (selected) {
      selected.classList.remove('map__pin--active');
    }
    evt.currentTarget.classList.add('map__pin--active');
  };


  var render = function (hosts) {
    hosts.forEach(function (host, i) {
      var pin = create(host);

      pin.addEventListener('click', function (evt) {
        pinClickHandler(evt, i);
      });
      list.appendChild(pin);
    });
  };

  window.pin = {
    render: render
  };
})();
