'use strict';

(function () {
  var hosts = [];
  var GETDATAURL = 'https://js.dump.academy/keksobooking/data';
  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', GETDATAURL);
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа' + xhr.status);
      }
    });
    xhr.send();

    xhr.addEventListener('error', function (xhr) {
      onError('Произошла ошибка ' + xhr.status);
    });

    var TIMEOUT = 10000;
    xhr.addEventListener('timeout', function (xhr) {
      if (xhr.timeout > TIMEOUT) {
        onError('Сервер не отвечает в течение' + xhr.timeout + 'секунд');
      }
    });
  };

  window.load(function (newHosts) {
    for (var i = 0; i < newHosts.length; i++) {
      hosts[i] = newHosts[i];
    }
    window.load.hosts = hosts;
  });
})();
