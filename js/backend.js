'use strict';

(function () {
  var TIMEOUT = 10000;

  var Url = {
    GET: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };

  var sendRequest = function (xhr, onLoad, onError) {
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      window.utils.statusCodeCB(xhr, onLoad, onError);
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    sendRequest(xhr, onLoad, onError);

    xhr.open('GET', Url.GET);
    xhr.send();
  };

  var send = function (data, onSend, onError) {
    var xhr = new XMLHttpRequest();

    sendRequest(xhr, onSend, onError);

    xhr.open('POST', Url.POST);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    send: send
  };

})();
