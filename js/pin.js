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

  var render = function () {

    var show = function (hosts) {
      hosts.forEach(function (host, i) {
        var pin = create(host);

        pin.addEventListener('click', function (evt) {
          var selected = document.querySelector('.map__pin--active');

          window.card.open(hosts[i]);

          if (selected) {
            selected.classList.remove('map__pin--active');
          }

          evt.currentTarget.classList.add('map__pin--active');
        });

        list.appendChild(pin);
      });
    };

    var setError = function (error) {
      return error;
    };

    window.backend.load(show, setError);
  };
  
  window.pin = {
    render: render
  };

})();
